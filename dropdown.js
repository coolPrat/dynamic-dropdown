var data = {
  0 : {"size" : ["10\"", "12\"", "14\"", "16\""]},
  1 : { "crust" : {
                "10\"" : ["Thin", "Gluten Free"],
                "14\"" : ["Flat bread","hard"],
                "12\"" : ["hard", "Gluten Free"],
                "16\"" : ["Flat bread", "Thin"]
		}
              },
  2 : {"sause" : {
                "Thin" : ["Red sause", "Pesto sause"],
                "hard" : ["BBQ Sauce", "Tapenade sause"]
              },
       "cheese" : {
                  "Gluten Free" : ["Feta cheese", "Mozzarella cheese"],
                  "Flat bread" : ["Cotija cheese", "Gouda cheese"]
                }
	},
  3: { "meat" : {
             "Mozzarella cheese" : ["Pepperoni", "Bacon"],
             "Pesto sause" : ["Sausage", "Chicken"],
             "Cotija cheese": ["Ham", "Shrimp"],
             "Tapenade sause": ["Beef", "Canadian Bacon"],
             "BBQ Sauce": ["Hamburger", "Chicken"],
             "Feta cheese": ["Bacon", "Shrimp"],
             "Gouda cheese" : ["Beef", "Sausage"],
             "Red sause" : ["Pepperoni", "Shrimp"]
             }
      },
  4:  {"veggies" : {
              "Feta cheese" : ["Red Peppers", "Jalapeno"],
              "Red sause" : ["Green Peppers", "Cashews"],
              "Gouda cheese": ["Olives", "Onions"],
              "BBQ Sauce": ["Jalapeno", "Cashews"],
              "Tapenade sause": ["Onions", "Mushrooms"],
              "Mozzarella cheese": ["Green Peppers", "Red Peppers"],
              "Cotija cheese" : ["Olives", "Spinach"],
              "Pesto sause" : ["Mushrooms", "Pineapple"]
              }
	}
};

var currentLevel = 10;
var workspace, orderName;
var expiry = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
var cookieEnabled;

/*
Function to check if cookkies are enabled and if usage of cookies
is allowed while used in standalone html file.
*/
function isCookieEnabled() {
  cookieEnabled = navigator.cookieEnabled;
  if (cookieEnabled === true) {
    SetCookie("Test_Cookie", "testing", expiry);
    if (GetCookie("Test_Cookie") === null) {
        cookieEnabled = false;
    }
  }
}

/*
Function to check if browser is a modern browser.
If it's not then download link is provided.
*/
function checkAndRedirect() {
  if(!document.getElementById || !document.getElementsByTagName || !document.createElement) {
    var alink = document.createElement("a");
    alink.setAttribute("href" , "https://www.mozilla.org/en-US/firefox/new/");
    // alink.setAttribute("style" , "margin-left:35%; padding-top:50px;");
    alink.appendChild(document.createTextNode("Please download Firefox here!"));
    document.getElementsByTagName("body")[0].appendChild(document.createTextNode("Your browser is not compatible."));
    document.getElementsByTagName("body")[0].appendChild(alink);
    return false;
  }
  return true;
}

/*
Initialization funtion. Adds text field for user to input it's name.
*/
function init() {

    if(checkAndRedirect()) {
    isCookieEnabled();

    var nameTextBox = document.createElement("input");
    nameTextBox.setAttribute("type", "text");
    nameTextBox.setAttribute("name", "nameForOrder");

    var nameLable = document.createElement("lable");
    nameLable.setAttribute("for", "nameForOrder");
    nameLable.appendChild(document.createTextNode("What's your name: "));

    var nameButton = document.createElement("button");
    nameButton.setAttribute("id", "buttonForName");
    nameButton.setAttribute("onClick", "checkCookieHelper('nameForOrder')");
    nameButton.appendChild(document.createTextNode("Let's GO!!"));

    var nameDiv = document.createElement("div");
    nameDiv.setAttribute("class","order-div");
    nameDiv.appendChild(nameLable);
    nameDiv.appendChild(nameTextBox);
    nameDiv.appendChild(nameButton);

    workspace = document.getElementById("workspace");
    workspace.appendChild(nameDiv);

	expiry = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
}

}

/*
Creates dropdown accordding to specified arguments.
*/
function createDropdown(dropdownData, level, tag) {
    var selectDiv = document.createElement("div");
    selectDiv.setAttribute("id", level);
    selectDiv.className = "selectDiv";

    var fieldset = document.createElement("fieldset");

    var selectLegend = document.createElement("legend");
    selectLegend.setAttribute("align","center");
    var selectElement = document.createElement("SELECT");

    var firstOption = new Option();
    firstOption.value = 0;
    firstOption.text = "-- Select --";

    selectElement.options.add(firstOption);
    selectElement.setAttribute("id", "dropdown" + level);
    selectDiv.className = selectDiv.className + " drop-div";
    selectElement.setAttribute("onChange", "captureInput(this)");

    var a = dropdownData[level];
    var lableText;
    var b = "";

    for(var key in a) {
        b = a[key];

        if( level === 0 ) {
            lableText = document.createTextNode("Size");
            selectLegend.appendChild(lableText);
        }
        if(level === 4) {
            tag = localStorage.getItem("2");
        }

        if (tag !== "" && typeof b[tag] != 'undefined') {
            b = b[tag];
            lableText = document.createTextNode(key );
            selectLegend.appendChild(lableText);
            break;
        }
    }

    a = b;

    for (var i = 0; i < a.length; i++) {
        var op = new Option();
        op.value = a[i];
        op.text = a[i];
        selectElement.options.add(op);
    }

    fieldset.appendChild(selectLegend);
    fieldset.appendChild(selectElement);
    selectDiv.appendChild(fieldset);
    return selectDiv;
}

/*
Function to capture selected option and can create next select element.
*/

function captureInput(selectItem) {
    var selectParent = selectItem.parentElement.parentElement;
    selectParent.style.backgroundColor = "#7ce26f";

    var selectId = selectItem.getAttribute("id");
    var selectedOption = selectItem[selectItem.selectedIndex].value;
    selectId = selectId.substring(8);
    var curId = parseInt(selectId);
    localStorage.setItem(curId,selectedOption);
    if(curId === 4) {
        processOrder();
    } else {
        if(curId < currentLevel) {
            removeSelect(curId);
        }
        currentLevel = curId + 1;
        var a = createDropdown(this.data, curId + 1, selectedOption);
        workspace.appendChild(a);
        moveDown(curId + 1);
    }
}

/*
Function to move the element down. This will cerate animation effect.
*/
function moveDown(elementId) {
  var element = document.getElementById(elementId);
  var pos = -10;
  var id = setInterval(down, 3);
  function down() {
    if (pos == 25) {
      clearInterval(id);
    } else {
      pos++;
      element.style.marginTop = pos + 'px';
    }
  }

}

/*
This function will process final order. The order selected will be added to storage option available.
*/
function processOrder() {
    var cur_order = [];
    for(var i =0; i < 5; i++) {
        cur_order[i] = localStorage.getItem(i);
        localStorage.removeItem(i);
    }
    var orderString =  cur_order.join('|');
    var pre_cookie = getPreviousOrder(orderName);
    if (pre_cookie === null) {
        addToOrders(orderName+"_order", [orderString].join(","));
    } else {
        var pre_orders = pre_cookie.split(",");
        pre_orders[pre_orders.length] = orderString;
        pre_order = pre_orders.join(",");
        addToOrders(orderName+"_order", pre_order);
    }
    printTheOrder(cur_order, false);
}

/*
Function used to add a order to storage option available.
*/
function addToOrders(orderName, order) {
  if (cookieEnabled) {
    SetCookie(orderName, order, expiry);
  }else {
    localStorage.removeItem(orderName);
    localStorage.setItem(orderName, order);
  }
}


/*
This function will check if previous orders are available.
*/
function checkCookie(name) {
    orderName = name;
    var pre_cookie = getPreviousOrder(orderName);

    var text = document.createElement("p");
    text.setAttribute("id", "firstPara");

    var textSpan = document.createElement("span");
    if (pre_cookie === null) {
        textSpan.appendChild(document.createTextNode("Hello " + orderName + ", It's your first order!!"));
    } else {
        textSpan.appendChild(document.createTextNode("Hello " + orderName + ", It's good to see you!!"));
        var aLink = document.createElement("button");

        aLink.setAttribute("onClick", "viewPrevOrders('" + orderName + "')");
        aLink.appendChild(document.createTextNode("View previous orders"));
        textSpan.appendChild(aLink);
    }
    text.setAttribute("class", "order-div");
    text.appendChild(textSpan);
    workspace.appendChild(text);
    addFirstSelect();
}

/*
This function will retrieve previous orders.
*/

function getPreviousOrder(orderName) {
  var pre_cookie = null;
  if(cookieEnabled) {
    pre_cookie = GetCookie(orderName+"_order");
  } else {
    pre_cookie = localStorage.getItem(orderName+"_order");
  }

  return pre_cookie;
}

/*
This function will add first select element.
*/
function addFirstSelect() {
	var currentLevel = 0;
	var a = createDropdown(this.data, 0, "Size");
	workspace.appendChild(a);
  moveDown(0);
}

/*
This will fetch previous orders on request.
*/
function viewPrevOrders(name) {
    var pre_cookie = getPreviousOrder(name);
    var pre_orders = pre_cookie.split(",");
    var orderDiv = document.createElement("div");
    orderDiv.setAttribute("id", "order-div");
    for (var i = 0; i < pre_orders.length; i++) {
        var order = pre_orders[i].split("|");
        orderDiv.appendChild(printTheOrder(order, true));
    }
    var firstList = document.getElementById("0");
    workspace.insertBefore(orderDiv, firstList);
}

/*
This will show the order just placed.
*/
function printTheOrder(theOrder, isPrev) {
    var pElement = getOrderParagraph(theOrder, isPrev);

    if(isPrev) {
        return pElement;
    } else {
        addLastDiv(pElement);
    }
}


/*
This will add div to show order placed.
*/
function addLastDiv(pElement) {
    var lastDiv = document.createElement("div");
    lastDiv.setAttribute("id", "lastDiv");
    lastDiv.setAttribute("class","order-div");
    lastDiv.appendChild(pElement);
    var lastButton = document.createElement("button");
    lastButton.setAttribute("onClick", "clearPage()");
    lastButton.appendChild(document.createTextNode("Place another order"));
    lastDiv.appendChild(lastButton);
    workspace.appendChild(lastDiv);
}


function getOrderParagraph(theOrder, isPrev) {
    var connectingText;
    if(isPrev) {
        connectingText = "Order";
    } else {
        connectingText = "Your order is ";
    }

    var pElement = document.createElement("div");
    pElement.setAttribute("id", "order-para");
    var para = document.createElement("P");
    para.setAttribute("class","print-order-div");
    para.appendChild(document.createTextNode(connectingText + ": "));
    for (var i = 0; i < 5; i++) {
        para.appendChild(document.createTextNode(theOrder[i] + " "));
        if (i === 1) {
            para.appendChild(document.createTextNode("crust with "));
        }
        if (i === 3) {
            para.appendChild(document.createTextNode("and "));
        }
    }

    pElement.appendChild(para);
    return pElement;
}


/*
This will clear page to place another order.
*/
function clearPage() {
    removeSelect(-1);
    var firstPara = document.getElementById("firstPara");
    workspace.removeChild(firstPara);
    var lastDiv = document.getElementById("lastDiv");
    workspace.removeChild(lastDiv);
    var orderDiv = document.getElementById("order-div");
    if (orderDiv) {
        workspace.removeChild(orderDiv);
    }

    checkCookie(orderName);
}


/*
This will remove a select element if some previous option is chaged.
*/
function removeSelect(after) {
    for (var i = after + 1; i < 5; i++) {
        var elementRemove = document.getElementById(""+i);
        if (elementRemove === null) {
            continue;
        } else {
            workspace.removeChild(elementRemove);
            localStorage.removeItem(i);
        }
    }
}

/*
Helper function for checkCookie.
*/
function checkCookieHelper(name) {
    checkCookie(document.getElementsByName(name)[0].value);
}
