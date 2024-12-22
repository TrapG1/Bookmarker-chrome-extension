document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-bookmark")
    const bookmarkList = document.getElementById("bookmark-list")

    //Loads bookmarks array we created from local device storage
    function loadBookmarks(){
        chrome.storage.local.get("bookmarks", (data) => {
            const bookmarks = data.bookmarks || []
            console.log(bookmarks)
            displayBookmarks(bookmarks)

        })
    }

    function displayBookmarks(bookmarks){
        bookmarkList.innerHTML = ""

        bookmarks.forEach((bookmark, index) =>{
            const bookmarkLI = document.createElement("li")
            const bookmarkTitle = document.createElement("span")

            bookmarkTitle.textContent = bookmark.title 

            const goButton = document.createElement("button")
            goButton.textContent = "Go"
            goButton.addEventListener("click", () =>{
                chrome.tabs.create({url: bookmark.url})
            })

            const delButton = document.createElement("button")
            delButton.textContent = "delete"
            delButton.addEventListener("click", () =>{
                bookmarks.splice(index, 1)
                chrome.storage.local.set({bookmarks}, loadBookmarks)
            })

            bookmarkLI.appendChild(bookmarkTitle)
            bookmarkLI.appendChild(goButton)
            bookmarkLI.appendChild(delButton)

            bookmarkList.appendChild(bookmarkLI);
        })
    }

    saveBtn.addEventListener("click", ()=>{
        chrome.tabs.query({active:true, currentWindow: true}, (tabs) =>{
            const bookmarkedTab = tabs[0]
            
            const bookmark = {
                title: bookmarkedTab.title,
                url: bookmarkedTab.url
            }

            chrome.storage.local.get("bookmarks", (data) =>{
                const bookmarks = data.bookmarks || []
                bookmarks.push(bookmark)
                chrome.storage.local.set({bookmarks}, loadBookmarks)
            })
        })
    })
    loadBookmarks()
})