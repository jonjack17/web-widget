import { CONFIG } from "/scripts/config.js"


// DOM object assignment.
const outerContainer = document.getElementById('outer-container')
const dataContainer = document.getElementById('data-container')
const addToPageBtn = document.getElementById('add-to-page-btn')
const getUserBtn = document.getElementById('get-user')
const createUserBtn = document.getElementById('create-user-btn')
const responseContainer = document.getElementById('response-container')
const formContainer = document.getElementById('create-user-container')
const sendUserBtn = document.getElementById('submit-btn')


// Set row headers for data container.
dataContainer.innerHTML = `
<div class="header-row">
    <div class="cell column-header name-cell"> Name </div>
    <div class="cell column-header email-cell"> Email </div>
    <div class="cell column-header"> Info </div>
    <div class="cell column-header"> Timestamp </div>
</div> 
`

// To be called when setting an error message in responseContainer
const renderErrorMessage = (message) => {
    responseContainer.classList.remove("hidden")
    responseContainer.classList.add("error-message")
    responseContainer.textContent = message

    setTimeout(() => {
        responseContainer.classList.add("hidden")
        responseContainer.classList.remove("error-message")
        responseContainer.textContent = ""
    }, 4000)
}

// To be called when setting a success message in responseContainer
const renderSuccessMessage = (message) => {
    responseContainer.classList.remove("hidden")
    responseContainer.classList.add("success-message")
    responseContainer.textContent = message

    setTimeout(() => {
        responseContainer.classList.add("hidden")
        responseContainer.classList.remove("success-message")
        responseContainer.textContent = ""
    }, 4000)
}

// Fetch all data from the server. Added error handling to account for server
// being down. ("Hard-coded" the error message.)

const getAllData = async () => {
    try {
        const url = CONFIG.API_URL;
        const response = await fetch(url);
        const jsonResponse = await response.json();
        console.log(response.status)
        return jsonResponse

    } catch (error) {
        console.log(error)
        let errorMsg = "Could not connect to server"
        renderErrorMessage(errorMsg)
    }
}

// Build an array of the IDs from each response item

let allUserData = await getAllData()

console.log(allUserData)
const getResponseIDs = (responseArray) => {
    let itemIDs = []
    responseArray.forEach((user) => {
        let id = user.id
        itemIDs.push(id)
    })
    return itemIDs
}
let responseIdArray = getResponseIDs(allUserData)



// Call the server for a specific data item. 'id' parameter comes from
// getUserBtn event listener.

// Added error handling for when API is called for an item that does
// not exist.
const getUser = async (id) => {
    try {
        const url = `${CONFIG.API_URL}/${id}`;
        const response = await fetch(url);
        const jsonResponse = await response.json();

        if (!response.ok) {
            throw new Error(`${response.status} - ${jsonResponse.message}`)
        }

        return jsonResponse
    } catch (error) {
        console.log(error)
        renderErrorMessage(error)

    }

}


// Each time the button is clicked, I am iterating through the 
// responseIdArray. So I'm getting each item's ID in turn, assigning
// that to itemId, then calling getUser with each itemId as the parameter.
// So the API is in effect called everytime the button is clicked.
let index = 0
getUserBtn.addEventListener("click", async (e) => {
    let itemId = responseIdArray[index]
    let userResponse = await getUser(itemId)
    createUserObject(userResponse)

    index += 1
    // Check if end of data array has been reached. If so, display "clear" btn
    if (index > allUserData.length - 1) {
        getUserBtn.disabled = true
        getUserBtn.textContent = "All Users Retrieved"
        getUserBtn.classList.toggle('btn-alternate')
        createClearBtn()
    }
})

// Create an object for each individual item retrieved from server.
// Assign properties from response object to this created object.
const createUserObject = (item) => {
    let userObject = {
        id: item.id,
        name: item.name ? item.name : "[Missing Name]",
        email: item.email ? item.email : "",
        info: item.info ? item.info : "[Missing Info]",
        fruit: item.fruit ? item.fruit : "",
        timestamp: item.timestamp ? item.timestamp : "[Missing Timestamp]"
    }

    // Refactored for security improvement - the only data I'm setting inside
    // innerHTML is the server-generated ID (not user input). Everything that is
    // user input is set using textContent.

    // Create a new row for each object. Each new row div element's id is 
    // supplied by the current userObject.
    dataContainer.innerHTML += `
        <div class="row" id=${userObject.id}>
        </div>
              `

    // Create divs for each userObject property. These become "cells" in
    // each row.

    // Name property (may exist)
    let nameDiv = document.createElement("div")
    nameDiv.classList.add("cell")
    nameDiv.classList.add("name-cell")

    if (userObject.name === "[Missing Name]") {
        nameDiv.style.color = "red"
        nameDiv.style.fontSize = ".7rem"
    }

    nameDiv.textContent = userObject.name
    document.getElementById(userObject.id).appendChild(nameDiv)

    // Email property (will always exist)
    let emailDiv = document.createElement("div")
    emailDiv.classList.add("cell")
    emailDiv.classList.add("email-cell")
    emailDiv.textContent = userObject.email
    document.getElementById(userObject.id).appendChild(emailDiv)


    // Info property (may exist)
    let infoDiv = document.createElement("div")
    infoDiv.classList.add("cell")

    if (userObject.info === "[Missing Info]") {
        infoDiv.style.color = "red"
        infoDiv.style.fontSize = ".7rem"
    }

    infoDiv.textContent = userObject.info

    // If userObject includes fruit info, display it in a <ul>
    if (userObject.fruit) {
        let fruitListTitle = document.createElement("p")
        fruitListTitle.textContent = "Favorite fruits:"
        let fruitList = document.createElement("ul")
        userObject.fruit.forEach((fruitItem) => {
            let fruitListItem = document.createElement("li")
            fruitListItem.textContent = fruitItem
            fruitList.appendChild(fruitListItem)
        })
        infoDiv.appendChild(fruitListTitle)
        infoDiv.appendChild(fruitList)
    }

    document.getElementById(userObject.id).appendChild(infoDiv)

    // Timestamp property (may exist). If exists, reformat for better display.
    let timestampDiv = document.createElement("div")
    timestampDiv.classList.add("cell")
    if (userObject.timestamp === "[Missing Timestamp]") {
        timestampDiv.classList.add("missing-data")
        timestampDiv.style.fontSize = ".7rem"
        timestampDiv.textContent = userObject.timestamp
    } else {
        const convertedDate = new Date(userObject.timestamp)
        const prettyDate = convertedDate.toLocaleString()
        timestampDiv.textContent = prettyDate
    }

    document.getElementById(userObject.id).appendChild(timestampDiv)

}

// Clear button resets dataContainer to just the column headers. Resets the
// responseIdArray index iterator back to zero.
const createClearBtn = () => {
    const clearBtn = document.createElement("button")
    outerContainer.insertBefore(clearBtn, dataContainer)
    clearBtn.classList.add('feature-btn')
    clearBtn.classList.add('clear-btn')
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

// POST new user using formData
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
        const response = await fetch(CONFIG.API_URL, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(bodyArray),
        })
        const resJson = await response.json()
        let successMsg = 'User added successfully!'
        renderSuccessMessage(successMsg)

        // After POST, get all data again so that newly created user can be 
        // displayed without page refresh.
        allUserData = await getAllData()
        responseIdArray = getResponseIDs(allUserData)

        if (!response.ok) {
            throw new Error(`${response.status} - ${resJson.message}`)

        }
    } catch (error) {
        console.log(error)
        renderErrorMessage(error)
    }

    createUserForm.reset()
})

const executeContentScript = async () => {
    try {
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true })
        await browser.tabs.executeScript(tab.id, { file: "scripts/content_scripts/addtopage.js" })
        console.log("Script injected successfully. Tab ID:", tab.id)

        let successMsg = 'Content added successfully'
        renderSuccessMessage(successMsg)

    } catch (error) {
        console.error("Error injecting script:", error)
        let errorMsg = 'Error injecting script'
        renderErrorMessage(errorMsg)
    }
}

addToPageBtn.addEventListener("click", executeContentScript)




