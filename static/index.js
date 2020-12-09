userData = JSON.parse(localStorage.getItem("userData") || "[]");
if(localStorage.getItem("activeUser")) {
    let user =  localStorage.getItem("activeUser");
    createList(user);
    loginPageTransition();
}
function checkUser() {
    const user = document.getElementById("userName").value;
    if(user === '') {alert("Enter Name");return }
    if (userData.length<1) {
        userData.push({user,list:[]});  //add new user to empty data array
    }else {
        for(const i of userData) {
            if(i.user === user) {       //user Already Registered
                localStorage.setItem("activeUser", user);
                loginPageTransition();
                createList(user);
                return ;
            }
        }
        if(userData.length >=3){  
            userData.shift();   //To Make sure we are saving only last 3 users
        }
        userData.push({user,list:[]});  //add new user to non-empty data array
    }
    localStorage.setItem("activeUser", user);
    localStorage.setItem("userData", JSON.stringify(userData));
    console.log(userData);
    loginPageTransition();
    createList(user);
}
function loginPageTransition(){
    document.getElementsByClassName("login")[0].style.display="none";
    document.getElementsByClassName("groceries")[0].style.display="block";
    document.getElementById("userDetails").innerHTML =localStorage.getItem("activeUser");
}
function userLogout() {
    document.getElementsByClassName("login")[0].style.display="block";
    document.getElementsByClassName("groceries")[0].style.display="none";
    localStorage.setItem("activeUser","");
}
function createList(user) {
    const parent = document.getElementById('groceriesList');
    while (parent.firstChild) {
        parent.firstChild.remove()  //sanitizing the list elememnt
    }
    const index = userData.findIndex(x => x.user ==user);
    for(let i=0;i<userData[index].list.length;i++) {
        let item = document.createElement('li');
        let span = document.createElement('span');
        span.classList.add('delete-button');
        span.classList.add('material-icons');
        let editSpan = document.createElement('span');
        editSpan.classList.add('edit-button');
        editSpan.classList.add('material-icons');
        item.appendChild(document.createTextNode(userData[index].list[i]));
        span.appendChild(document.createTextNode("delete"));
        editSpan.appendChild(document.createTextNode("create"));
        item.appendChild(span);
        item.appendChild(editSpan);
        document.getElementById('groceriesList').appendChild(item);
    } 
    deleteElement();    
    editElement();  
    bagSpace();
}
function deleteElement() {
    function remove(){
        let el = this.parentNode;
        this.remove();
        let deletedItem = el.innerHTML;
        el.remove();
        const userIndex = userData.findIndex(x => x.user == localStorage.getItem("activeUser"));
        const deleteIndex = userData[userIndex].list.indexOf(deletedItem);
        userData[userIndex].list.splice(deleteIndex,1);
        localStorage.setItem("userData", JSON.stringify(userData));
        bagSpace();
    };   
    var lis = document.querySelectorAll('.delete-button');   
    for (var i = 0, len = lis.length; i < len; i++) {
        lis[i].addEventListener('click', remove, false);
    }
}
function saveNewItem(newItem) {
    document.getElementById("newItem").value='';
    const index = userData.findIndex(x => x.user == localStorage.getItem("activeUser"));
    if(userData[index].list.length >=5){
        $('#alertModal').modal('show');       
        return;
    }
    userData[index].list.push(newItem);
    localStorage.setItem("userData", JSON.stringify(userData));
    createList(localStorage.getItem("activeUser"));
    bagSpace();
}

function editElement() {
    let prevVal;
    function editContent() {
        const text =document.getElementById('EditItem').value;
        const userIndex = userData.findIndex(x => x.user == localStorage.getItem("activeUser"));
        const dataIndex = userData[userIndex].list.indexOf(prevVal);
        userData[userIndex].list[dataIndex] =text;
        localStorage.setItem("userData", JSON.stringify(userData));
        createList(localStorage.getItem("activeUser"));
    }
    function initiateEdit(){
        let parentel = this.parentNode.firstChild.textContent
        prevVal=parentel;
        $('#editItemModal').modal('show');
        document.getElementById('EditItem').value=parentel;

    };    
    var lis = document.querySelectorAll('.edit-button');   
    for (var i = 0, len = lis.length; i < len; i++) {
        lis[i].addEventListener('click', initiateEdit, false);
    } 
    document.getElementById('editSaveButton').addEventListener('click', editContent,false);   
}
function bagSpace() {
    const userIndex = userData.findIndex(x => x.user == localStorage.getItem("activeUser"));
    const spaceUsed = userData[userIndex].list.length;
    document.getElementById('bag-capacity').innerHTML = 5 - spaceUsed;
}
