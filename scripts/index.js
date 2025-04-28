

const testEl=document.getElementById('test')
const getAllUsersBtn = document.getElementById('get-all-users')

testEl.textContent = 'test'



async function displayAllData() {
    const url = "http://localhost:3000/data/";
    const response = await fetch(url);
    
    const jsonResponse = await response.json();

    const normalizedResponse = await jsonResponse.map(user => ({
         
        id:user.id,
        name:user.name,
        email: user.email,
        info: user.info,
        fruit: user.fruit

    }))

   return normalizedResponse
}   

const normalizedResponse = await displayAllData()


console.log(normalizedResponse[0].info)


// getAllUsersBtn.addEventListener("click", function(e) {
//     displayAllData()
   
// })


