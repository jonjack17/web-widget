


const testEl=document.getElementById('test')

testEl.textContent = 'test'


async function getAllData() {
    const url = "http://localhost:3000/data/1";
    const response = await fetch(url);
    
    const jsonResponse = await response.json();
    
    testEl.innerHTML = `${jsonResponse.info}`
    console.log(typeof jsonResponse)
}

getAllData()


