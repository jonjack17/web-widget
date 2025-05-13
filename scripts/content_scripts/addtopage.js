
console.log("This page has been modified")

//  DOM object assignment/element creation
const bodyParagraphs = document.body.querySelectorAll("p")
const newDiv = document.createElement("div")
const messageP = document.createElement("p")
const randSent = document.createElement("p")

messageP.textContent = "The following content has been added by Web Widget:"
newDiv.appendChild(messageP)

// Create array of text content from all "p" elements on current tab.
let pArray = []

bodyParagraphs.forEach((p) => {
    pArray.push(p.textContent)
})

// Concatenate pArray into one string, then split it on "." back into an array
// separate sentences.
const pageString = pArray.join(" ")
const sentenceArray = pageString.split(".")

// Updated sentenceArray to account for "...", which result in items in array that
// are empty strings.

const updatedSentenceArray = sentenceArray.filter((item) => {
    return item.length > 3
})

let randomIndex = Math.floor(Math.random() * updatedSentenceArray.length)
randSent.textContent = `${updatedSentenceArray[randomIndex]}.`
newDiv.appendChild(randSent)
document.body.appendChild(newDiv)

// Added "undefined" to avoid "non-structured-clonable-data" error
// https://github.com/hypothesis/browser-extension/issues/369
undefined




