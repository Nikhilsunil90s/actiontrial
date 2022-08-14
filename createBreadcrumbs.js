let breadcrumbedHeaderTemplate = `
    <a href="./Home.html" style="padding-top: 5px; text-decoration: underline;" onClick="(function(){
        localStorage.removeItem('links')
        localStorage.removeItem('hiddenlinks')
        localStorage.removeItem('currentPageTitle')
    })();">Home</a>
`;


let headerLinks = localStorage.getItem("links") ? JSON.parse(localStorage.getItem("links")) : [];
let hiddenLinks = localStorage.getItem("hiddenlinks") ? JSON.parse(localStorage.getItem('hiddenlinks')) : [];
let currentPageTitle = localStorage.getItem("currentPageTitle") ? localStorage.getItem('currentPageTitle') : "";
let tooltipContent = "";

const createToolipContent = async () => {

    let hiddenBCSpan = document.getElementById("hiddenBCSpan");
    let _tooltipContent = ``;

    let _tooltipContentPromise = await new Promise((resolve, reject) => {
        hiddenLinks.map((hnl, index) => {
            _tooltipContent += `<a class="hiddenBC" style="padding: 10px;" href=${hnl.uri}>${currentPageTitle[index]}</a><br>`;

            if (index == hiddenLinks.length - 1) {
                resolve(_tooltipContent)
            }
        })
    })
    tooltipContent = _tooltipContentPromise;

    if (hiddenBCSpan != undefined) {
        hiddenBCSpan.innerHTML = _tooltipContent;
    }


    let allHiddenBC = document.querySelectorAll(".hiddenBC");
    console.log(allHiddenBC);

    if (allHiddenBC.length != 0) {
        allHiddenBC.forEach((abc, index) => {
            abc.addEventListener("click", () => {
                let _clicked = abc.innerHTML;
                let _currentPageTitle = localStorage.getItem("currentPageTitle").trim();
                let _links = JSON.parse(localStorage.getItem("links"));
                let _splitTitleIndex = _currentPageTitle.split(",").indexOf(_clicked);
                let link = _links.slice(0, _splitTitleIndex + 1);
                localStorage.setItem("links", JSON.stringify(link));
            })
        })
    }


    return _tooltipContentPromise;
}

const createBreadCrumbs = async () => {
    let _template = "";
    let _hiddenBCTemplate = "";
    currentPageTitle = currentPageTitle.split(",").filter(cPT => {
        return cPT != ""
    });
    if (headerLinks.length < 4) {
        headerLinks.map((headerLink, index) => {
            if (index == headerLinks.length - 1 && currentPageTitle[index]) {
                _template += `<span style="margin-left: 7px; padding-top: 2px"> > </span>` +
                    `<a id="headerLinks" style="margin-left: 7px; padding-top: 5px" href=${headerLink.uri}>${currentPageTitle[index]}
                </a>`
            } else {
                _template += `<span style="margin-left: 7px; padding-top: 2px"> > </span>` +
                    `<a id="headerLinks" style="margin-left: 7px; padding-top: 5px; position: relative" href=${headerLink.uri}>${currentPageTitle[index] ? (currentPageTitle[index].length > 4 ? currentPageTitle[index].slice(0, 11) + '..' : currentPageTitle[index]) : currentPageTitle[index]}
                    ${currentPageTitle[index] ? (currentPageTitle[index].length > 4 ? `<span id="tooltip" style='display: none;'>${currentPageTitle[index]}</span>` : "") : ""}
                </a>`
            }
        })
        breadcrumbedHeaderTemplate += _template;
    } else {
        for (let i = 0; i < headerLinks.length - 1; i++) {
            hiddenLinks.findIndex(x => x.uri == headerLinks[i].uri) == -1 ? hiddenLinks.push(headerLinks[i]) : console.log('item exists!');;
        }
        localStorage.setItem('hiddenlinks', JSON.stringify(hiddenLinks));
        let _topTemplate = `<span style="margin-left: 7px; padding-top: 2px"> > </span>
                            <a id="hiddenLinks" style="margin-left: 7px; padding-top: 5px; cursor: pointer;">...`;

        let _bottomTemplate = `</a><span style="margin-left: 7px; padding-top: 2px"> > </span>` +
            `<a style="margin-left: 7px; padding-top: 5px; text-decoration: underline;" href=${headerLinks[headerLinks.length - 1].uri}>${currentPageTitle[headerLinks.length - 1]}</a>`;

        let _middleTemplate = `<span id="hiddenBCSpan" style="display: none; position: absolute;"></span>`;
        breadcrumbedHeaderTemplate += _topTemplate + _middleTemplate;
        breadcrumbedHeaderTemplate += _bottomTemplate;
    }

    breadcrumbedHeaderTemplate += `<style> 

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
            border-radius: 6px;
            text-align: center;
            padding: 5px;
        }

        .hoverclass2 {
            color: red;
        }

        .hoverclass2 {
            display: block !important;            
            color: #ffffff;
            position: absolute;
            left: 19em;
            background-color: #35363a;
            border: 1px solid grey;
            padding: 5px;
            z-index: 1;
            text-align: left;

        }

        #hiddenBCSpan .hiddenBC {
            diplay: inline-block !important;
            position: relative;
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
        localStorage.setItem("links", JSON.stringify(headerLinks));
    }
}

const applyBreadcrumbs = () => {
    let _header = document.querySelector("header");
    let rightSection = _header.innerHTML.slice(_header.innerHTML.indexOf("<div>"));
    _header.innerHTML = `<div style="display: flex;">` + breadcrumbedHeaderTemplate + `</div>` + rightSection;
    let hrs = document.querySelectorAll("#headerLinks"); // headerlinks
    hrs.forEach((headLink, index) => {
        headLink.addEventListener("click", () => {
            let _currentPageTitle = localStorage.getItem("currentPageTitle");
            let clickedLink = headLink.innerHTML.split("\n")[0];
            let _indexForSlice = 0;
            _currentPageTitle.split(",").forEach((_cpt, index) => {
                if (_cpt.slice(0, 7) == clickedLink.slice(0, 7)) {
                    _indexForSlice = index;
                }
            })
            _currentPageTitle = _currentPageTitle.split(",").slice(0, _indexForSlice + 1);
            if (index != headerLinks.length) {
                headerLinks = headerLinks.slice(0, index + 1);
                localStorage.setItem('links', JSON.stringify(headerLinks));
            }
            localStorage.setItem('currentPageTitle', _currentPageTitle.join(",") + ",");

        })
    })

    let hls = document.querySelectorAll("#hiddenLinks"); // hiddenlinks
    // hls.forEach(hlink => {
    //     hlink.addEventListener("click", () => {
    //         let _currentPageTitle = localStorage.getItem("currentPageTitle");
    //         _currentPageTitle = _currentPageTitle.split(",").slice(0, _currentPageTitle.split(",").length - 2)
    //         localStorage.setItem('currentPageTitle', _currentPageTitle.join(",") + ",");
    //         let lastItem = hiddenLinks[hiddenLinks.length - 1];
    //         hiddenLinks = hiddenLinks.slice(0, hiddenLinks.length - 1);
    //         headerLinks = headerLinks.slice(0, headerLinks.length - 1);
    //         localStorage.setItem('links', JSON.stringify(headerLinks));
    //         localStorage.setItem('hiddenlinks', JSON.stringify(hiddenLinks));
    //         hlink.setAttribute("href", lastItem.uri);
    //     })
    // })

    let allHeaderLinks = document.querySelectorAll("#headerLinks")

    if (allHeaderLinks.length != 0) {
        allHeaderLinks.forEach((ahl, index) => {
            allHeaderLinks[index].addEventListener("mouseover", () => {
                allHeaderLinks[index].querySelector("#tooltip").classList.add('hoverclass');
            })

            allHeaderLinks[index].addEventListener("mouseleave", () => {
                allHeaderLinks[index].querySelector("#tooltip").classList.remove('hoverclass');
            })
        })

    }

    let allHiddenLinks = document.querySelectorAll("#hiddenLinks");

    if (allHiddenLinks.length != 0) {
        allHiddenLinks.forEach((ahl, index) => {
            allHiddenLinks[index].addEventListener("mouseover", () => {
                document.querySelector("#hiddenBCSpan").classList.add('hoverclass2');
            })

            allHiddenLinks[index].addEventListener("mouseleave", () => {
                document.querySelector("#hiddenBCSpan").classList.remove('hoverclass2');
            })
        })

    }

}

window.onload = async () => {
    let pagePromise = await new Promise((resolve, reject) => {
        let pageTitle = document.querySelectorAll("[data-title]");
        let pT = pageTitle[0].dataset.title;
        resolve(pT);
    })
    if (pagePromise !== 'Website Index') {
        if (currentPageTitle.indexOf(pagePromise) == -1) {
            currentPageTitle += pagePromise + ",";
            localStorage.setItem("currentPageTitle", currentPageTitle);
        }
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
        })
    })
}