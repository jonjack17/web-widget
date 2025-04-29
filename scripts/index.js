

const testEl=document.getElementById('test')
const getAllUsersBtn = document.getElementById('get-all-users')

testEl.textContent = 'test'



async function getAllData() {
    const url = "http://localhost:3000/data/";
    const response = await fetch(url);
    
    const jsonResponse = await response.json();

//     const normalizedResponse = await jsonResponse.map(user => ({
         
//         id:user.id,
//         name:user.name,
//         email: user.email,
//         info: user.info,
//         fruit: user.fruit

//     }))

//    return normalizedResponse
    return jsonResponse
}   

getAllData()

const userData = await getAllData()


console.log(userData)

function renderAllUsers() {
    
    const allUsersHtml = userData.map(user => {
        if (user.name) {
            return ` 
            <div class= "user-container">
                <p>${user.name} </p>
                


            </div>
        
        
        `
    } else {
        return `missing data`
    }

    }).join('')
    testEl.innerHTML = `
    
        ${allUsersHtml}
    `
}






getAllUsersBtn.addEventListener("click", function(e) {
    renderAllUsers()
   
})


