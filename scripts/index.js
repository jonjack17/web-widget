
// DOM object assignment.
const outerContainer = document.getElementById('outer-container')
const dataContainer=document.getElementById('data-container')
const btnContainer = document.getElementById('btn-container')
const addToPageBtn = document.getElementById('add-to-page-btn')
const getUserBtn = document.getElementById('get-user')
const createUserBtn = document.getElementById('create-user-btn')
const responseContainer = document.getElementById('response-container')
const formContainer = document.getElementById('create-user-container')
const sendUserBtn = document.getElementById('submit-btn')


// Set row headers for data container. Will always be displayed.
dataContainer.innerHTML = `
<div class="header-row">
    <div class="cell column-header name-cell"> Name </div>
    <div class="cell column-header email-cell"> Email </div>
    <div class="cell column-header"> Info </div>
    <div class="cell column-header"> Timestamp </div>
</div> 

`

// Fetch all data from the API. Added error handling to account for server
// being down. ("Hard-coded" the error message.)

const getAllData = async () => {
    try {
        const url = "http://localhost:3000/data/";
        const response = await fetch(url);
    
        const jsonResponse = await response.json();
        console.log(response.status)
        return jsonResponse
        
        } catch(error) {
        console.log(error)
        responseContainer.classList.remove("hidden")
        responseContainer.classList.add("error-message")
        responseContainer.textContent = "Could not connect to server"
            }
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
    // Added error handling for when API is called for an item that does
    // not exist.
    try {
        const url = `http://localhost:3000/data/${id}`;
        const response = await fetch(url);
        const jsonResponse = await response.json();

        if (!response.ok) {
            throw new Error(`${response.status} - ${jsonResponse.message}`)

        }
        return jsonResponse
    } catch(error) {
        console.log(error)
            responseContainer.classList.remove("hidden")
            responseContainer.classList.add("error-message")
            responseContainer.textContent = error
        setTimeout(() => {
            responseContainer.classList.add("hidden")
            responseContainer.classList.remove("error-message")
            responseContainer.textContent = ""
        }, 4000)
        
    }
    
}   




const createUserObject = (item) => {
    let userObject = {
        id : item.id,
        name :item.name ? item.name : "Missing Name",
        email: item.email ? item.email : "Missing Email",
        info:  item.info ? item.info : "Missing Info",
        fruit: item.fruit ? item.fruit : "",
        timestamp: item.timestamp ? item.timestamp : "Missing Timestamp"

      
    }
   
    // Refactored for security improvement - the only data I'm setting inside
    // innerHTML is the server-generated ID (not user input). Everything that is
    // user input is set using textContent.
    
    dataContainer.innerHTML += `
        <div class="row" id=${userObject.id}>
        </div>
              `       

    let nameDiv = document.createElement("div") 
    nameDiv.classList.add("cell")
    nameDiv.classList.add("name-cell")  
    nameDiv.textContent = userObject.name
    document.getElementById(userObject.id).appendChild(nameDiv)
    
    let emailDiv = document.createElement("div") 
    emailDiv.classList.add("cell")  
    emailDiv.classList.add("email-cell") 
    emailDiv.textContent = userObject.email
    document.getElementById(userObject.id).appendChild(emailDiv)   

    let infoDiv = document.createElement("div") 
    infoDiv.classList.add("cell")
    infoDiv.textContent = userObject.info

    if (userObject.fruit) {
        let fruitListTitle = document.createElement("p")
        fruitListTitle.textContent = "Favorite fruits:"
        let fruitList = document.createElement("ul")
        userObject.fruit.forEach( (fruitItem) =>{
            let fruitListItem = document.createElement("li")
            fruitListItem.textContent = fruitItem
            fruitList.appendChild(fruitListItem)
        })
        infoDiv.appendChild(fruitListTitle)
        infoDiv.appendChild(fruitList)
    } 
    
    document.getElementById(userObject.id).appendChild(infoDiv)
      

    let timestampDiv = document.createElement("div") 
    timestampDiv.classList.add("cell")  
    timestampDiv.textContent = userObject.timestamp
    document.getElementById(userObject.id).appendChild(timestampDiv)   

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
        const resJson = await response.json()
        responseContainer.classList.remove("hidden")
        responseContainer.classList.add("success-message")
        responseContainer.textContent =`User added successfully!`
       
        setTimeout(() => {
            responseContainer.classList.add("hidden")
            responseContainer.classList.remove("success-message")
            responseContainer.textContent = ""
        }, 3000)
        
        
        if (!response.ok) {
            throw new Error(`${response.status} - ${resJson.message}`)

        }
        } catch(error) {
            console.log(error)
            responseContainer.classList.remove("hidden")
            responseContainer.classList.add("error-message")
            responseContainer.textContent = error

            setTimeout(() => {
                responseContainer.classList.add("hidden")
                responseContainer.classList.remove("error-message")
                responseContainer.textContent = ""
            }, 3000)
        }

    createUserForm.reset()
   console.log((bodyArray))
})

const executeContentScript = async () => {
    try {
        const [tab] = await browser.tabs.query({active: true, currentWindow: true})
        await browser.tabs.executeScript(tab.id, {file: "scripts/content_scripts/addtopage.js"})
        console.log("Success", tab.id)
    } catch(error) {
        console.error("Error injecting script:", error)
    }
}

addToPageBtn.addEventListener("click", executeContentScript)




