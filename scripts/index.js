

const outerContainer = document.getElementById('outer-container')
const dataContainer=document.getElementById('data-container')
const btnContainer = document.getElementById('btn-container')
const getUserBtn = document.getElementById('get-user')
const createUserBtn = document.getElementById('create-user-btn')
const responseText = document.getElementById('response-text')
const formContainer = document.getElementById('create-user-container')
const sendUserBtn = document.getElementById('submit-btn')




// Fetch all data from the API
const getAllData = async () => {
    const url = "http://localhost:3000/data/";
    const response = await fetch(url);

    const jsonResponse = await response.json();
    console.log(response.status)
    return jsonResponse
   
}   


let allUserData = await getAllData()

// Get an array of the IDs for each response item
const getResponseIDs = () => {
    let itemIDs = []
    allUserData.forEach((user) => {
        let id = user.id
        itemIDs.push(id)
    })
    return itemIDs
}

let responseIdArray = getResponseIDs()

// Call the API for a specific data item. 'id' parameter comes from
// getUserBtn event listener.
const getUser = async (id) => {
    const url = `http://localhost:3000/data/${id}`;
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse
}   



dataContainer.innerHTML = `
<div class="header-row">
    <div class="cell column-header"> Name </div>
    <div class="cell column-header"> Email </div>
    <div class="cell column-header"> Info </div>
    <div class="cell column-header"> Timestamp </div>
</div> 

` 
const createUserObject = (item) => {
    let userObject = {
        id : item.id,
        name :item.name ? item.name : "Missing Name",
        email: item.email ? item.email : "Missing Email",
        info:  item.info ? item.info : "Missing Info",
        fruit: item.fruit ? item.fruit : "Missing Fruit Data",
        timestamp: item.timestamp ? item.timestamp : "Missing timestamp"

      
    }
    

    dataContainer.innerHTML += `
        <div class="row">
            <div class="cell">${userObject.name}</div>
            <div class="cell">${userObject.email}</div>
            <div class="cell">
                ${userObject.info}
                <p class = "fruit" > Fruit:${userObject.fruit} </p>
            </div>
            <div class="cell">${userObject.timestamp}</div>
        </div>
              `              
                            
}


// Each time the button is clicked, I am iterating through the 
// responseIdArray. So I'm getting each item ID in turn, assigning
// that to itemId, then calling getUser with each itemId as the parameter.
// So the API is in effect called everytime the button is clicked.
let index = 0
getUserBtn.addEventListener("click", async (e) => {
    let itemId = responseIdArray[index]
    let userResponse = await getUser(itemId)
   createUserObject(userResponse)

   index += 1
//    Check if end of data array has been reached. If so, display "clear" btn
   if (index > allUserData.length-1) {
        getUserBtn.disabled = true
        getUserBtn.textContent = "All Users Retrieved"
        getUserBtn.classList.toggle('btn-alternate')
        createClearBtn()
        
        
}

})

const createClearBtn = () => {
    const clearBtn= document.createElement("button")
    outerContainer.insertBefore(clearBtn, dataContainer)
    clearBtn.classList.toggle('feature-btn')
    clearBtn.classList.toggle('clear-btn')
    clearBtn.textContent = "Clear Display?"

    clearBtn.addEventListener("click", (e) => {
        index = 0
        dataContainer.innerHTML = `
        <div class="header-row">
            <div class="cell column-header"> Name </div>
            <div class="cell column-header"> Email </div>
            <div class="cell column-header"> Info </div>
            <div class="cell column-header"> Timestamp </div>
        </div> 
        ` 
        clearBtn.classList.toggle("hidden")
        getUserBtn.disabled = false
        getUserBtn.textContent = "Get User"
        getUserBtn.classList.toggle('btn-alternate')
    
    })
}

createUserBtn.addEventListener("click", (e) => {
    formContainer.classList.toggle("hidden")
})


sendUserBtn.addEventListener("click", async (e) => {
    e.preventDefault()
    const createUserForm = document.getElementById('create-user-form')
    const formData = new FormData(createUserForm)
    let formDataObject = {}
    formData.forEach((value, key) => {
        formDataObject[key] = value
    })

    const bodyArray = []
    bodyArray.push(formDataObject)
    
    
   

   
    formContainer.classList.toggle("hidden")
    try {
        const response = await fetch("http://localhost:3000/data/", {
            headers: {
                "Content-Type" : "application/json",
            },
            method: "POST",
            body: JSON.stringify(bodyArray),
        })
        const resText = await response.text()
        responseText.innerText =`API Response: \n ${resText}`
        if (!response.ok) {
            throw new Error(`${response.status} \n ${resText}`)

        }
        } catch(error) {
            console.log(error)
            responseText.innerText = `API Response: \n ${error}`
        }

    createUserForm.reset()
   console.log((bodyArray))
})