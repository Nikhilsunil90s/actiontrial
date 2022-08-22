let breadcrumbedHeaderTemplate = `
    <a href="./Home.html" style="padding-top: 5px; text-decoration: underline;" onClick="(function(){
        window.localStorage.removeItem('links')
        window.localStorage.removeItem('hiddenlinks')
        window.localStorage.removeItem('currentPageTitle')
    })();"><h1 class="flex-item">Home</h1></a>
`;


let headerLinks = window.localStorage.getItem("links") ? JSON.parse(window.localStorage.getItem("links")) : [];
let hiddenLinks = window.localStorage.getItem("hiddenlinks") ? JSON.parse(window.localStorage.getItem('hiddenlinks')) : [];
let currentPageTitle = window.localStorage.getItem("currentPageTitle") ? window.localStorage.getItem('currentPageTitle') : "";
let tooltipContent = "";

const createToolipContent = async () => {
    hiddenLinks = window.localStorage.getItem("hiddenlinks") ? JSON.parse(window.localStorage.getItem('hiddenlinks')) : [];
    let hiddenBCSpan = document.getElementById("hiddenBCSpan");
    let _tooltipContent = ``;

    let _tooltipContentPromise = await new Promise((resolve, reject) => {
        _tooltipContent += `<p style="text-align: center; margin-top: 0px; padding: 5px!important; font-size: 16px; font-weight: 600; line-height: 20px;background-color: grey;">Your Journey</p>`;
        let uriTextArray = currentPageTitle.slice(0, hiddenLinks.length);
        uriTextArray = uriTextArray.reverse();
        hiddenLinks.reverse().map((hnl, index) => {
            _tooltipContent += `<p style="line-height: 10px;margin-top:15px;margin-bottom:15px;"><a class="hiddenBC" style="padding: 5px;position: relative;" href=${hnl.uri}>${uriTextArray[index]}</a></p>`;
            if (index == hiddenLinks.length - 1) {
                _tooltipContent += `<button id="button" style="display: none;color: #ffffff;cursor:pointer; text-decoration: underline; background-color: grey;border: 0px;padding: 5px;margin: 5px 55px;">Entries</button>`
                resolve(_tooltipContent)
            }
        })
    })
    tooltipContent = _tooltipContentPromise;

    if (hiddenBCSpan != undefined) {
        hiddenBCSpan.innerHTML = _tooltipContent;
    }

    let allHiddenBC = document.querySelectorAll(".hiddenBC");

    if (allHiddenBC.length != 0) {
        allHiddenBC.forEach((abc, index) => {
            abc.addEventListener("click", () => {
                let _clicked = abc.innerHTML;
                let _currentPageTitle = window.localStorage.getItem("currentPageTitle").trim();
                let _links = JSON.parse(window.localStorage.getItem("links"));
                let _splitTitleIndex = _currentPageTitle.split(",").indexOf(_clicked);
                let link = _links.slice(0, _splitTitleIndex + 1);
                let ci = _currentPageTitle.split(",").slice(0, _splitTitleIndex + 1);
                let hl = hiddenLinks.reverse().slice(0, _splitTitleIndex);
                window.localStorage.setItem("links", JSON.stringify(link));
                window.localStorage.setItem("hiddenlinks", JSON.stringify(hl));
                window.localStorage.setItem("currentPageTitle", ci.join(",") + ",")
            })
        })
    }

    if (allHiddenBC.length > 2) {
        let btn = document.getElementById("button");
        let _hidden = true;
        for (let x = 3; x < allHiddenBC.length; x++) {
            allHiddenBC[x].style.display = 'none';
            btn.style.display = 'inline';
            btn.innerHTML = `+ ${allHiddenBC.length - 3} Entries`;
        }
    }

    let moreButton = document.querySelector("#button");
    if (moreButton) {
        moreButton.addEventListener("click", () => {
            moreButton.style.display = 'inline!important';
            for (let x = 3; x < allHiddenBC.length; x++) {
                allHiddenBC[x].classList.toggle('toggleLinks');
                if (allHiddenBC[x].getAttribute("class").indexOf('toggleLinks') > -1) {
                    moreButton.innerHTML = "Less Entries";
                } else {
                    moreButton.innerHTML = `+ ${allHiddenBC.length - 3} Entries`;
                }
            }
        })
    }

    return _tooltipContentPromise;
}

const createBreadCrumbs = async () => {
    headerLinks = window.localStorage.getItem("links") ? JSON.parse(window.localStorage.getItem("links")) : [];
    hiddenLinks = window.localStorage.getItem("hiddenlinks") ? JSON.parse(window.localStorage.getItem('hiddenlinks')) : [];
    currentPageTitle = window.localStorage.getItem("currentPageTitle") ? window.localStorage.getItem('currentPageTitle') : "";

    let _template = "";
    currentPageTitle = currentPageTitle.split(",").filter(cPT => {
        return cPT != ""
    });
    if (headerLinks.length < 3) {
        window.localStorage.setItem("hiddenlinks", JSON.stringify([]));
        headerLinks.map((headerLink, index) => {
            if (index == headerLinks.length - 1 && currentPageTitle[index]) {
                _template += `<span style="margin-left: 7px; padding-top: 2px; font-size: 10px; line-height: 30px;"> > </span>` +
                    `<a id="headerLinks"  style="margin-left: 7px; padding-top: 5px" href=${headerLink.uri}><h1 class="flex-item">${currentPageTitle[index]}</h1>
                </a>`
            } else {
                _template += `<span style="margin-left: 7px; padding-top: 2px; font-size: 10px; line-height: 30px;"> > </span>` +
                    `<a id="headerLinks" style="margin-left: 7px; padding-top: 5px; position: relative" href=${headerLink.uri}><h1 class="flex-item">${currentPageTitle[index] ? (currentPageTitle[index].length > 5 ? currentPageTitle[index].slice(0, 11) + '..' : currentPageTitle[index]) : currentPageTitle[index]}
                    ${currentPageTitle[index] ? (currentPageTitle[index].length > 4 ? `<span id="tooltip" style='display: none;'>${currentPageTitle[index]}</span>` : "") : ""}</h1>
                </a>`
            }
        })
        breadcrumbedHeaderTemplate += _template;
    } else {
        for (let i = 0; i < headerLinks.length - 1; i++) {
            hiddenLinks.findIndex(x => x.uri == headerLinks[i].uri) == -1 ? hiddenLinks.push(headerLinks[i]) : console.log('item exists!');;
        }
        window.localStorage.setItem('hiddenlinks', JSON.stringify(hiddenLinks));
        let _topTemplate = `<span style="margin-left: 7px; padding-top: 2px; font-size: 10px; line-height: 30px;"> > </span>
                            <a id="hiddenLinks" style="margin-left: 7px; cursor: pointer;">...`;

        let _bottomTemplate = `</a><span style="margin-left: 7px; padding-top: 2px; font-size: 10px; line-height: 30px;"> > </span>` +
            `<a style="margin-left: 7px;padding-top: 5px; text-decoration: underline; cursor: pointer;" href=${headerLinks[headerLinks.length - 1].uri}>
            <h1 class="flex-item">${currentPageTitle[headerLinks.length - 1]}</h1>
            </a>`;

        let _middleTemplate = `<span id="hiddenBCSpan" style="display: none; position: absolute; width: 200px!important; margin-top: 20px;"></span>`;
        breadcrumbedHeaderTemplate += _topTemplate + _middleTemplate;
        breadcrumbedHeaderTemplate += _bottomTemplate;
    }

    breadcrumbedHeaderTemplate += `<style> 

    header > div > a > .flex-item {
        font-size: .75rem;
    line-height: 3rem;
    margin: 0;
    margin-bottom: -0.5rem;
    font-family: var(--body-font);
    font-weight: 400;
    }

        .toggleLinks {
                display: inline!important;
        }

        #headerLinks {
            text-decoration: underline;
        }

        .hoverclass {
            display: block !important;
            top: 100%;
            left: 50%;
            position: absolute;
            background-color: #35363a;
            color: #ffffff;
            width: max-content;
            border: 1px solid grey;
            text-align: center;
            padding: 5px;
        }

        .hoverclass2 {
            color: red;
        }

        .hoverclass2 {
            display: inline-block !important;            
            color: #ffffff;
            position: absolute;
            left: 15em;
            background-color: #35363a;
            border: 1px solid grey;
            z-index: 1;
            text-align: left;
        }

        #more {
            display: none;
        }

        .hiddenBC {
            color: #ffffff;
        }
     </style>`
}

const addHeaderLinks = (headerLinkData) => {
    if (headerLinks.some(val => val[headerLinkData.uri])) { // exists already
        console.log(headerLinks);
    } else {
        headerLinks.push(headerLinkData);
        window.localStorage.setItem("links", JSON.stringify(headerLinks));
    }
}

const applyBreadcrumbs = () => {
    let _header = document.querySelector("header");
    let rightSection = _header.innerHTML.slice(_header.innerHTML.indexOf("<div>"));
    _header.innerHTML = breadcrumbedHeaderTemplate + rightSection;
    let hrs = document.querySelectorAll("#headerLinks"); // headerlinks
    hrs.forEach((headLink, index) => {
        headLink.addEventListener("click", () => {
            let _currentPageTitle = window.localStorage.getItem("currentPageTitle");
            let clickedLink = headLink.innerHTML.split("\n")[0];
            let _indexForSlice = 0;
            _currentPageTitle.split(",").forEach((_cpt, index) => {
                if (_cpt.slice(0, 7).trim() == clickedLink.slice(0, 7).trim()) {
                    _indexForSlice = index;
                }
            })
            _currentPageTitle = _currentPageTitle.split(",").slice(0, _indexForSlice + 1);
            if (index != headerLinks.length) {
                headerLinks = headerLinks.slice(0, index + 1);
                window.localStorage.setItem('links', JSON.stringify(headerLinks));
            }
            window.localStorage.setItem('currentPageTitle', _currentPageTitle.join(",") + ",");

        })
    })

    let hls = document.querySelectorAll("#hiddenLinks"); // hiddenlinks

    let allHeaderLinks = document.querySelectorAll("#headerLinks")

    if (allHeaderLinks.length != 0) {
        allHeaderLinks.forEach((ahl, index) => {
            allHeaderLinks[index].addEventListener("mouseover", () => {
                allHeaderLinks[index].querySelector("#tooltip") ?
                    allHeaderLinks[index].querySelector("#tooltip").classList.add('hoverclass') :
                    null;
            })

            allHeaderLinks[index].addEventListener("mouseleave", () => {
                allHeaderLinks[index].querySelector("#tooltip") ?
                    allHeaderLinks[index].querySelector("#tooltip").classList.remove('hoverclass') :
                    null;
            })
        })

    }

    let allHiddenLinks = document.querySelectorAll("#hiddenLinks");

    if (allHiddenLinks.length != 0) {
        allHiddenLinks.forEach((ahl, index) => {
            allHiddenLinks[index].addEventListener("mouseover", () => {
                document.querySelector("#hiddenBCSpan") ?
                    document.querySelector("#hiddenBCSpan").classList.add('hoverclass2') :
                    null;
            })

            allHiddenLinks[index].addEventListener("mouseleave", () => {
                document.querySelector("#hiddenBCSpan") ?
                    document.querySelector("#hiddenBCSpan").classList.remove('hoverclass2') :
                    null;
            })
        })

    }

}

window.onload = async () => {
    if (performance.getEntriesByType("navigation")[0].type == 'back_forward') {
        alert('back clicked');
        let link = headerLinks.slice(0, headerLinks.length - 1)
        window.localStorage.setItem("links", JSON.stringify(link));
        let hl = hiddenLinks.slice(0, hiddenLinks.length - 1);
        window.localStorage.setItem("hiddenlinks", JSON.stringify(hl));
        let ci = currentPageTitle.split(",").slice(0, currentPageTitle.split(",").length - 2);
        ci.length < 1 ? window.localStorage.setItem("currentPageTitle", ci.join(",")) : window.localStorage.setItem("currentPageTitle", ci.join(",") + ",");
    }

    let pagePromise = await new Promise((resolve, reject) => {
        let pageTitle = document.querySelectorAll("[data-title]");
        let pT = pageTitle[0].dataset.title;
        if (pT.indexOf(",") > -1) {
            pT = pT.split(",")[0];
        }
        resolve(pT);
    })
    if (pagePromise !== 'Website Index') {
        console.log(pagePromise);
        if (currentPageTitle.indexOf(pagePromise) == -1) {
            currentPageTitle += pagePromise + ",";
            window.localStorage.setItem("currentPageTitle", currentPageTitle);
            console.log(localStorage.getItem('currentPageTitle'));
        }
    } else {
        console.log(pagePromise);
        window.localStorage.removeItem('links')
        window.localStorage.removeItem('hiddenlinks')
        window.localStorage.removeItem('currentPageTitle')
    }

    let element_a = document.querySelectorAll("a");
    if (headerLinks != []) {
        createBreadCrumbs();
        applyBreadcrumbs();
    }

    if (hiddenLinks != []) {
        createToolipContent();
    }



    element_a.forEach(element => {
        element.addEventListener("click", () => {
            let uri = element.getAttribute('href');
            let _headerData = {
                uri: uri,
            }
            addHeaderLinks(_headerData);
            if (typeof window.history.pushState === "function") {
                window.history.pushState(uri, null, null);

            }

        })
    })
}
