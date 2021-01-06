// Const
const ullist = document.querySelector(".ul_list")
const sideBarDiv = document.querySelector(".sidebarDiv")
const restaurantDiv = document.querySelector(".restaurants-div")
const rightDiv = document.querySelector(".other-div")
const listUrl = 'http://localhost:3000/lists'
const h3Title = restaurantDiv.querySelector('h3')
const nameDiv = document.querySelector(".usernameDiv")

// Render functions

let showLoginPage = () => {
    sideBarDiv.innerHTML= "Login in to see your lists!"
    h3Title.innerText = "Enter your name below to see your Lists:"

    let loginForm = document.createElement('form')
    loginForm.classList.add('centered')

    let nameDiv = document.createElement('div')
    nameDiv.className = "form-group"
    let nameLabel = document.createElement('label')
    nameLabel.htmlFor = "name"
    nameLabel.innerText = "name"

    let nameInput = document.createElement('input')
    nameInput.type = "text"
    nameInput.className = "form-control"
    nameInput.id = "name"
    nameInput.placeholder = "Enter Name"
    nameInput.autocomplete = "off"

    nameDiv.append(nameLabel, nameInput)

    let submitButton = document.createElement('button')
    submitButton.type = "submit"
    submitButton.className = "btn btn-primary"
    submitButton.innerText = "Login"

    loginForm.append(nameDiv, submitButton)

    restaurantDiv.append(loginForm)

    loginForm.addEventListener("submit", handleLoginForm )

}

// what to do with User Response

let showUserInformation = (user) => {
    setUsernameDiv(user)
    setListDiv(user)
    // setNewFormList(user)

}

// set usernameDiv After Login

let setUsernameDiv = (user) => {
    restaurantDiv.innerHTML = " "
    nameDiv.innerHTML = " "
    let h3NameTag = document.createElement('h3')
    h3NameTag.innerText = `Welcome ${user.name}!`

    let logOutButton = document.createElement('button')
    logOutButton.className = "btn btn-danger"
    logOutButton.innerText = "Logout"

    nameDiv.append(h3NameTag, logOutButton)

    logOutButton.addEventListener("click", (evt) => {
        logOut()
    })
}

let logOut = () => {
    nameDiv.innerHTML = " "
    sideBarDiv.innerHTML = " "
    restaurantDiv.innerHTML = " "
    showLoginPage()
}


let setListDiv = (user) => {
    
    ullist.innerHTML = " "
    sideBarDiv.innerHTML = `<form class="create-new-list-form">
    <h3>Create a new list</h3>
    <input
      type="text"
      name="title"
      value=""
      placeholder="Enter the list's name..."
      class="input-text"
    />
    <br><br />
    <input
      type="text"
      name="description"
      value=""
      placeholder="Enter the list desription"
      class="input-area"
    />
    <br><br />
    <input
      type="submit"
      name="submit"
      value="Create New List"
      class="submit"
    />
  </form>`
    console.log(user)
    user.lists.forEach(renderListLi)
    const createList = document.querySelector('.create-new-list-form')
    createList.addEventListener('submit', function (event){
        const id = user.id
        event.preventDefault()
    
    
        const newListObj = {
            title: event.target.title.value, 
            description: event.target.description.value, 
            restaurants: [],
            user_id: id
        }
    
    debugger
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
        .then(list => renderListLi(list),
        // How do I then get this to add to the page with all the details?
        )
    
        event.target.reset()
    })

}

let renderListLi = (list) => {
    
        const li = document.createElement('li')

        li.textContent = list.title
        li.dataset.id = list.id
        ullist.append(li)
        sideBarDiv.append(ullist)
}




function renderRestaurants(listObj){
//
    // restaurantCollection = document.querySelector('.restaurantsDiv')
    // debugger

     
    restaurantDiv.innerHTML = `
        <h3> ${listObj.title} </h3>
        <p>${listObj.description}</p>`

        rightDiv.innerHTML= `
        <form class="add-restaurant-form">
        <h4>Add a new restaurant to this list</h4>

       <input
          type="text"
          name="name"
          value=""
          placeholder="Enter a restaurant's name..."
          class="input-text"
        />
        <br><br />
        <input
          type="submit"
          name="submit"
          value="Add Restaurant"
          class="submit"
        />

        </form>
        <br></br>
        `
    listObj.restaurants.forEach(restaurant => {
        const divCard = document.createElement('div')
    debugger
        divCard.innerHTML = `
        <h3>${restaurant.name}</h3>
        <h4>${restaurant.cuisine}</h4>
        <h4>${restaurant.address}</h4>
        <img src=${restaurant.image_url} width="200" height="200">
        <br></br>

        <a href="${restaurant.website_url}" >Website</a>
        <br></br>
        <button>Remove Restaurant</button>
        `
        const removeBtn = divCard.querySelector('button')
        
        const restid = restaurant.id 
        listObj.AddRestaurantToLists.filter(item => {
            if (item.restaurant_id === restid)
            removeBtn.dataset.id = item.id
            console.log(removeBtn.dataset.id)
        }
            )
        

        removeBtn.addEventListener("click", handleRemoveButton )

        restaurantDiv.append(divCard)
        
    })
}


// Fetch functions

let handleRemoveButton = (evt) => {
    evt.preventDefault()
    const id = evt.target.dataset.id
    console.log(id)

    fetch(`http://localhost:3000/AddRestaurantToLists/${id}`, {
        method: "DELETE"
    }).then(res => res.json())
    .then(console.log)
}

let handleLoginForm = (evt) => {
    evt.preventDefault()
    let name = evt.target.name.value
    console.log(name)

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
            showUserInformation(returnedData)
        } else {
            console.error(returnedData.error)
        }
    })  
}

// const getOneRestaurant = id => {
//     fetch(`http://localhost:3000/restaurants/${id}`)
//     .then(resp => resp.json())
//     .then(console.log)
// }

function getRestaurantsFromList(listID) {
    fetch(`http://localhost:3000/lists/${listID}`)
    .then(resp => resp.json())
    .then(listObj => renderRestaurants(listObj))
}

function getOneList(id) {
    fetch(`http://localhost:3000/lists/${id}`)
    .then(resp => resp.json())
    .then(data => console.log(data))

}


// event listeners

ullist.addEventListener("click", evt => {
    evt.preventDefault()
    const id = evt.target.dataset.id 
    // debugger
    getRestaurantsFromList(id)
    // getOneList(id)
})







// initializers 
// getLists()
showLoginPage()
//   getRestaurants()