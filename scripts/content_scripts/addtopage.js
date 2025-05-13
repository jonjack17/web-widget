
console.log("This page has been modified")

const bodyParagraphs = document.body.querySelectorAll("p")
const newDiv = document.createElement("div")
const messageP = document.createElement("p") 
const randSent = document.createElement("p")

messageP.textContent = "The following content has been added by Web Widget:"
newDiv.appendChild(messageP)


let pArray = []

bodyParagraphs.forEach((p) => {
    pArray.push(p.textContent)
})

let pageString = pArray.join(" ")



let sentenceArray = pageString.split(".")

// let randomIndex = Math.random


console.log(sentenceArray)
console.log(pageString)

// newDiv.appendChild(randSent)
document.body.appendChild(newDiv)



// Added "undefined" to avoid "non-structured-clonable-data" error
// https://github.com/hypothesis/browser-extension/issues/369
undefined




