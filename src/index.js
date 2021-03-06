// Const
const parentDiv = document.querySelector('.parent')
const ullist = document.querySelector(".ul_list")
const sideBarDiv = document.querySelector(".before-login-sidebarDiv")
const restaurantDiv = document.querySelector(".before-login-restaurants-div")
const rightDiv = document.querySelector(".other-div")
const listUrl = 'http://localhost:3000/lists'
const h3Title = restaurantDiv.querySelector('h3')
const nameDiv = document.querySelector(".before-login-usernameDiv")
const body = document.querySelector("body")

var user = {}


// Render functions

let showLoginPage = () => {
    sideBarDiv.innerHTML= " "
    h3Title.innerText = " "

    restaurantDiv.innerHTML= `
    <form action="/" class="login-form">
    <header>Grubdex</header>
    <div class="field"><span class="fa fa-user"></span><input type="text" id="name" placeholder="Enter Name"></div>
    <input type="submit" class="submit" value="LOGIN"></input>`

   const loginForm = document.querySelector('.login-form')

    loginForm.addEventListener("submit", handleLoginForm)
}


let showUserInformation = (user) => {
    setUsernameDiv(user)
    setListDiv(user)
}

// set usernameDiv After Login

let setUsernameDiv = (user) => {
    restaurantDiv.innerHTML = 
    `<h4 class= 'txt opening-title'>Welcome To Grubdex, ${user.name}!</h4>
    <img class='opening-image' src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf2583y6P6gdT2i49HFtbfUCyFMsDdwgSC7w&usqp=CAU >
    <p class='txt opening-text'>"Sharing food with another human being is an intimate act that should not be indulged in lightly" - M.F.K. Fisher</p>`
    restaurantDiv.className = "after-login-restaurants-div"

    nameDiv.innerHTML = " "
    nameDiv.className = "after-login-usernameDiv"
    let h3NameTag = document.createElement('h3')
    h3NameTag.innerText = `${user.name}`
    h3NameTag.id = "user-name-on-screen"

    nameDiv.append(h3NameTag)

   
    const userNameOnScreen = document.querySelector('#user-name-on-screen')
    userNameOnScreen.addEventListener("click", userProfilePage)


}


let userProfilePage = () => {
        restaurantDiv.innerHTML = 
        `<h4 class= 'txt opening-title'>This is Grubdex, ${user.name}!</h4>
        <p class='txt opening-text'>You currently have ${user.lists.length} lists</p>
        <p class='txt opening-text'>Select a list to view restaurants. Some ideas of lists: </p>
        <ul class="list-group">
            <li>♦ "Las Vegas Favorite Steakhouses"</li>
            <li>♦ "NYC Restaurants with the most amount of outdoor heaters ⛄️"</li>
        </ul>
        <br>
        <p><i>Ability to share lists with other users coming soon!</i></p>
        <br>`
        restaurantDiv.className = "after-login-restaurants-div"
        rightDiv.innerHTML = ``

        let logOutButton = document.createElement('button')
        logOutButton.className = "btn btn-danger btn-sm"
        logOutButton.innerText = "Logout"

        restaurantDiv.append(logOutButton)
        logOutButton.addEventListener("click", logOut)
}

let logOut = () => {
    nameDiv.innerHTML = " "
    nameDiv.className = "before-login-usernameDiv"
    sideBarDiv.innerHTML = " "
    sideBarDiv.className = "before-login-sidebarDiv"
    restaurantDiv.innerHTML = " "
    restaurantDiv.className = "before-login-restaurants-div"
    rightDiv.innerHTML=" "
    showLoginPage()
}


//this loads the list div on the left after login
let setListDiv = (user) => {
    sideBarDiv.innerHTML = " "
    sideBarDiv.className = "after-login-sidebarDiv"

    if (!user.lists[0]) {
        userHasNoLists()
    }
    ullist.innerHTML = "<h6><u>Current Lists</u></h6>"
    user.lists.forEach(renderListLi)


    newListButton = document.createElement('button')
    newListButton.className = "btn btn-outline-primary btn-sm"
    newListButton.innerHTML = `Add a new list`
    sideBarDiv.append(newListButton)

    newListButton.addEventListener("click", showAddListPage)
    
}

let renderListLi = (list) => {
    const li = document.createElement('li')
    
    li.textContent = list.title
    li.dataset.id = list.id
    ullist.append(li)
    sideBarDiv.append(ullist)
}

//renders all restaurants on main div
function renderLists(listObj){
    // restaurantCollection = document.querySelector('.restaurantsDiv')
     const id = listObj.id
    // debugger
    restaurantDiv.innerHTML = `
        <h3> ${listObj.title} </h3>
        <p>${listObj.description}</p>`

        rightDiv.innerHTML= `
        <br></br>
        <button class = "btn btn-primary btn-sm" id="add-restaurant-to-list-button" data-id = ${id} >Add Restaurant</button>
        <br></br>
        <button class="btn btn-secondary btn-sm" id="delete-list-button" data-id = ${id} >Delete list</button>
        <br></br>

        <h5>Update List Info</h5>
        <form id="form-to-update-list">
        <div class="form-group">
            <label for="title">Title:</label>
            <input
                type="text"
                class="form-control"
                id="title"
                value= "${listObj.title}">
        </div>
        <div class="form-group">
            <label for="description">Description:</label>
            <textarea
                class="form-control"
                id = "description"
                name="description"
                rows = "2"  
            >${listObj.description}</textarea>
        </div>
        <input
          type="submit"
          name="submit"
          value="Update List"
          class="btn btn-primary btn-sm"
        />
        </div>
        </form>
        
        
        `

        newDiv = document.createElement('div')
        newDiv.id = 'map'
        restaurantDiv.appendChild(newDiv)
    
        // debugger
        renderRestaurantsOnList(listObj.restaurants, listObj.AddRestaurantToLists)
        const deleteListButton = document.querySelector('#delete-list-button')

        deleteListButton.addEventListener("click", event => {
        const id = event.target.dataset.id
        console.log(id)

        deleteListFunction(id)  

        removeListFromList(id)

        //reroute to screen where it clears divs and asks to select another list
        userProfilePage()
    })

    const updateForm = document.querySelector("#form-to-update-list")
    updateForm.dataset.id = listObj.id
    updateForm.addEventListener("submit", evt => {
        // debugger
        evt.preventDefault()
        const id = evt.target.dataset.id
        
        const updatedObj = {
             title: evt.target.title.value,
             description:  evt.target.description.value
        }
        updateListInfo(updatedObj, id)
        
    }) 
    renderUserInfo(user)  

    const addRestaurantToListButton = document.querySelector('#add-restaurant-to-list-button')

    addRestaurantToListButton.addEventListener("click", event=> {
        restaurantDiv.innerHTML = ``
        rightDiv.innerHTML = ``
        
        listID = event.target.dataset.id

        const data = { username: 'example' };

        fetch(`http://localhost:3000/restaurants/`)
        .then(resp => resp.json())
        .then(restaurantListObj => renderRestaurantAPI(restaurantListObj, listID))     
    })


}

function renderRestaurantsOnList(restObj,addRestToListsObj) {
    
    // debugger
    if (restObj[0]){
        initMap()
    } else  {
        document.getElementById("map").remove()
        
        const divCard = document.createElement('div')
        divCard.innerHTML = `<br><br><h5 id="empty-list">You should try and add some restaurants to this list 🍱</h5>`
        restaurantDiv.append(divCard)
    }
    
    restObj.forEach((restaurant,index) => {
        index = (index + 1).toString()
        const divCard = document.createElement('div')
        divCard.className = "before-container"
        divCard.innerHTML = `
        <br><br><br>
        <img class="rounded float-right" src=${restaurant.image_url} width="150" height="150">
        <h3 class= restaurant-index>${index}.</h3>
        <a href="${restaurant.website_url}" ><h3 class= "rest-name">${restaurant.name}</h3></a>
        <h4>${restaurant.cuisine}</h4>
        <h4 class= restaurant-address>${restaurant.address}</h4>
        <button class="btn btn-outline-danger">Remove Restaurant</button>
        <br>
        <br>
        `
        const removeBtn = divCard.querySelector('button')
        
        const restid = restaurant.id 
        addRestToListsObj.filter(item => {
            if (item.restaurant_id === restid)
            removeBtn.dataset.id = item.id
        })
        const pos = {lat: parseFloat(restaurant.lat), lng: parseFloat(restaurant.lng)}
        const marker = new google.maps.Marker({
            position: pos,
            map: map,
            label: index
          });

        const listID = addRestToListsObj[0].list_id

        removeBtn.dataset.listid = listID
        removeBtn.addEventListener("click", handleRemoveButton )
        restaurantDiv.append(divCard)
    })
}

function renderRestaurantAPI(restObj, listID) {

    restaurantDiv.innerHTML = `
    <h3> Choose A Restaurant From the List:</h3>
    <br></br>`

    // const searchForm = document.querySelector('.form-inline')
    // const searchBtn =  searchForm.querySelector('.btn')
    // searchForm.addEventListener('submit', evt => {
    //     evt .stopImmediatePropagation()
    // debugger
    // console.log(evt)


    // })      
    // debugger
    restObj.forEach(restaurant => {
        const divCard = document.createElement('div')
        divCard.className = "after-container"
        divCard.innerHTML = `
        <br>
        <img class = "rounded float-right" src=${restaurant.image_url} width="150" height="150">
        <a href="${restaurant.website_url}"><h3>${restaurant.name}</h3></a>
        
        <h4>${restaurant.cuisine}</h4>
        <h4>${restaurant.address}</h4>
        <button class="btn btn-success" id="add-restaurant-button" data-id = ${restaurant.id}>Add Restaurant to List</button>
        
        `
        const addBtn = divCard.querySelector('#add-restaurant-button')
        // debugger
        addBtn.addEventListener("click", evt=> {
            let restaurantID = evt.target.dataset.id;
            //  listID is here
            addRestaurantToListFetch(restaurantID, listID)
            
            //in here, i want to have the listid, and restaurant id
        //then create Addrestauranttolist
        //then reload restaurant list for this list
        })
        //put entire function here, try grqb listID


        restaurantDiv.append(divCard)

    })
}

let searchRestaurantAPI = () => { 
   

}
//remove from DOM and from USER
let removeListFromList = (id) => {
    // debugger


    for (var i=0; i<user.lists.length; i++){
        if (user.lists[i].id == id) {
            
                    user.lists.splice(i, 1); 
                } }




    let ulList = document.querySelector('.ul_list').children
    let spreaded = [...ulList]
    let toRemove =spreaded.find(item => item.dataset.id == id)
    toRemove.remove()
}

let addListToList = (list) => {
    user.lists.push(list)
    let ulList = document.querySelector('.ul_list')
    li = document.createElement('li')
    li.textContent = list.title
    li.dataset.id = list.id 
    ulList.appendChild(li)
    getRestaurantsFromList(list.id)
}

let userHasNoLists = (input) => {
    // debugger
}


let showAddListPage = () => {

    restaurantDiv.innerHTML =``
    rightDiv.innerHTML = ``
    newDiv = document.createElement('div')
    newDiv.innerHTML = `
    <br><br />
    <form id="create-new-list-form">
    <h5>Create a New List 📝</h5>
    <div class="form-group">
    
        <input
        type="text"
        name="title"
        placeholder="Enter the list name..."
        />
    </div>
    <div class="form-group">
        <label for="description">List Description:</label>
        <br>
        <textarea
            name="description"
            id:"description"
            rows = "4"></textarea>

    
       
    </div>
    <input
      type="submit"
      name="submit"
      value="Create New List"
      class="btn btn-primary btn-sm"
    />
  </form>`
   
  restaurantDiv.append(newDiv)
    
    const createList = document.querySelector('#create-new-list-form')
    
    createList.addEventListener('submit', function (event){
        const id = user.id
        event.preventDefault()
    
        const newListObj = {
            title: event.target.title.value, 
            description: event.target.description.value, 
            restaurants: [],
            user_id: id
        }
    
        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(newListObj)
        }
    
        fetch('http://localhost:3000/lists', config)
        .then(resp => resp.json())
        .then(list => addListToList(list))
        // debugger
        event.target.reset()
    })
}


// Fetch functions

//removes restaurant from a list -- need to add render
let handleRemoveButton = (evt) => {
    evt.preventDefault()
    const id = evt.target.dataset.id
    const listid = evt.target.dataset.listid
    fetch(`http://localhost:3000/AddRestaurantToLists/${id}`, {
        method: "DELETE"
    }).then(res => res.json())
    .then(data => getRestaurantsFromList(data.list_id))
}


//coming from render restaurant API at bottoom event listener
let handleAddRestaurantToListButton = (evt) => {
    // debugger

    //in here, i want to have the listid, and restaurant id
    //then create Addrestauranttolist
    //then reload restaurant list for this list
}

let handleLoginForm = (evt) => {
    evt.preventDefault()
    let name = evt.target.name.value

    fetch('http://localhost:3000/log_me_in', {
        method: "POST",
        headers: {
            "Accept": "Application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify({
            loginName: name
        })
    })
    .then(res => res.json())
    .then((returnedData) => {
        if(returnedData.id) {
            user = returnedData
            showUserInformation(returnedData)
            
        } else {
            console.error(returnedData.error)
            // how to render error:
            // sideBarDiv.innerHTML = `${returnedData.error}`
        }
    })  
}

function updateListInfo(updatedObj,id) {
    fetch(`http://localhost:3000/lists/${id}`, {
        method: "PATCH",
        headers: {
            "Accept": "Application/json",
            "content-type": "application/json"
        },
        body: JSON.stringify(updatedObj)
    }).then(res => res.json())
    .then(data => renderLists(data))
}
function renderUserInfo(user) {
    fetch(`http://localhost:3000/users/${user.id}`)
    .then(res => res.json())
    .then(user => setListDiv(user))
}


// const getOneRestaurant = id => {
//     fetch(`http://localhost:3000/restaurants/${id}`)
//     .then(resp => resp.json())
//     .then(console.log)
// }

function getRestaurantsFromList(listID) {
    fetch(`http://localhost:3000/lists/${listID}`)
    .then(resp => resp.json())
    .then(listObj => renderLists(listObj))
}

function getOneList(id) {
    fetch(`http://localhost:3000/lists/${id}`)
    .then(resp => resp.json())
    .then(data => console.log(data))

}

//

function addRestaurantToListFetch(restaurantID, listID) {
    // debugger
    const data = { 
        list_id: listID,
        restaurant_id: restaurantID
        };

    fetch('http://localhost:3000/AddRestaurantToLists', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        getRestaurantsFromList(data.list_id)
    })

}

//fetch Deletes a list and clears it from the left hand div
function deleteListFunction(id)  {
    fetch(`http://localhost:3000/lists/${id}`, {
            method: "DELETE"})
        .then(res => res.json())
        .then(data => {console.log(data)
        })
    }


// event listeners

ullist.addEventListener("click", evt => {
    evt.preventDefault()
    const id = evt.target.dataset.id
     
    getRestaurantsFromList(id)
})



//initialize map
function initMap() {

    // The location of nyc
    const nyc = { lat: 40.731, lng: -73.935 };
 
    // The map, centered at NYC
     map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      center: nyc,
    });
  }


//initializers
showLoginPage()

