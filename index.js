let myLeads =  [];

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");

const ulEl = document.getElementById("ul-el");

const deleteBtn = document.getElementById("delete-btn");

const leadsFromLocalStorage =JSON.parse(localStorage.getItem("myLeads"));

const tabBtn = document.getElementById("tab-btn");

const saveBtn = document.getElementById("save-btn");

if(leadsFromLocalStorage){
    myLeads = leadsFromLocalStorage;
    render(myLeads);
}

//Save the leads into txt file.
saveBtn.addEventListener("click", function(){

    if(confirm("Do you want to save the leads to txt file?\nAll of the leads will be cleared after txt file is downloaded."))
    {
        let data = new File([myLeads], "myLeads.txt", {type: "text/plain"});
        let downloadLink = document.createElement("a");
        downloadLink.download = "myLeads.txt";
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL != null)
        {
            // Chrome allows the link to be clicked
            // without actually adding it to the DOM.
            downloadLink.href = window.webkitURL.createObjectURL(data);
        }
        else
        {
            // Firefox requires the link to be added to the DOM
            // before it can be clicked.
            downloadLink.href = window.URL.createObjectURL(data);
            downloadLink.onclick = destroyClickedElement;
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }

        downloadLink.click();

        localStorage.clear();
        myLeads = []
        //Re-render the leads.
        render(myLeads);

    }
    

})

function destroyClickedElement(event)
{
    document.body.removeChild(event.target);
}

tabBtn.addEventListener("click", function(){
    //Push the tab url into the myLeads array.
    chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
        if(myLeads.includes(tabs[0].url)){
            alert("Duplicate of url is not allowed!");
        }
        else{
            myLeads.push(tabs[0].url);
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
            render(myLeads);
        }
    });
});

function render(leads){
    let listItems = " ";
    //Remember to use absolute file path, https://www.dmkamfdm.com
    for(let i=0; i<leads.length; i++){
        listItems += `
            <li>
                <a href='${leads[i]}' target='_blank'>
                    ${leads[i]}
                </a>
            </li> `;

        /* const li= document.createElement("li");
        li.textContent = myLeads[i];
        ulEl.append(li);
    */
    }
    //costs is reduced when the innerHTML only render one time outside of the loop.
    ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("click", function(){

    if(!myLeads.length){

        alert("There is no lead exists in extension.")
    }
    else{
        if(confirm("Do you sure want to delete all of the leads?")){
            localStorage.clear();
            myLeads = []
            //Re-render the leads.
            render(myLeads);
        }
    }
})




inputBtn.addEventListener("click", function(){
    //Get input value.
    myLeads.push(inputEl.value);
    inputEl.value= "";

    localStorage.setItem("myLeads", JSON.stringify(myLeads));

    //Call render() function.
    render(myLeads);
})





