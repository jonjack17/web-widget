
const outerContainer = document.getElementById('outer-container')
const dataContainer=document.getElementById('data-container')
const getUserBtn = document.getElementById('get-user')
const btnContainer = document.getElementById('btn-container')


dataContainer.textContent = "ready to get data"



const getAllData = async () => {
    const url = "http://localhost:3000/data/";
    const response = await fetch(url);

    const jsonResponse = await response.json();

    return jsonResponse
}   

getAllData()

const userData = await getAllData()


console.log(userData)

dataContainer.innerHTML = `
<div class="header-row">
    <div class="cell column-header"> Name </div>
    <div class="cell column-header"> Email </div>
    <div class="cell column-header"> Info </div>
    <div class="cell column-header"> Timestamp </div>
</div> 
` 
const createUserObject = (index) => {
    let userObject = {
        id : userData[index].id,
        name :userData[index].name ? userData[index].name : "Missing Name",
        email: userData[index].email ? userData[index].email : "Missing Email",
        info:  userData[index].info ? userData[index].info : "Missing Info",
        fruit: userData[index].fruit ? userData[index].fruit : "Missing fruit data",
        timestamp: userData[index].timestamp ? userData[index].timestamp : "Missing timestamp"

      
    }
    
   
    dataContainer.innerHTML += `
        <div class="row">
            <div class="cell">${userObject.name}</div>
            <div class="cell">${userObject.email}</div>
            <div class="cell">${userObject.info}</div>
            <div class="cell">${userObject.timestamp}</div>
        </div>
              `              
                            
}

let count = 0

getUserBtn.addEventListener("click", (e) => {
   createUserObject(count)
   count += 1
//    Check if end of data array has been reached. If so, display "clear" btn
   if (count > userData.length-1) {
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
        count = 0
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

