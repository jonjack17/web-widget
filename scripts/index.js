

const testEl=document.getElementById('test')

testEl.textContent = 'test'


async function getAllData() {
    const url = "http://localhost:3000/data/";
    const response = await fetch(url);
    
    const jsonResponse = await response.json();
    
    testEl.innerHTML = jsonResponse[0].info
    console.log(typeof jsonResponse)
}

getAllData()


