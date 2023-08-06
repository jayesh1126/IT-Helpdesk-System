// New EJS stuff

/* 
 * Prepare form on modal for user to enter values to create ticket
 */
function createTicket() {
    // When the user clicks on the button, open the modal
    var createTicketModal = document.getElementById("create-ticket-modal");
    createTicketModal.style.display = "block";

    // Hide new type column
    let newCreateTypeCol = document.querySelector('.newCreateTypeCol');
    newCreateTypeCol.style.display = 'none';

    // Hide new create external specialist column
    let newCreateExternalSpecialistCol = document.querySelector('.newCreateExternalSpecialistCol');
    newCreateExternalSpecialistCol.style.display = 'none';

    // Make reporter name being filled automatically
    let input2 = document.querySelector('#viewReporter');
    usernumb = $("#nav-placeholder").data("userid");
    input2.value = usernumb
}



/**
 * Show ticket modal when ticket card is clicked
 * 
 */
 function showTicket(ticketID) {



    

    // Show view ticket modal
    var viewTicketModal = document.getElementById("view-ticket-modal");
    viewTicketModal.style.display = "block";



    // Ajax request to get ticket details from database
    $.post('/ticket', result = { 
        ID: $("#ticket"+ticketID).data("id"),
        Description: $("#ticket"+ticketID).data("description"),
        ReporterNo: $("#ticket"+ticketID).data("reporter"),
        AssignedSpecialistID: $("#ticket"+ticketID).data("assignedspecialist"),
        SoftwareID: $("#ticket"+ticketID).data("software"),
        HardwareID: $("#ticket"+ticketID).data("hardware"),
        Priority: $("#ticket"+ticketID).data("priority"),
        State: $("#ticket"+ticketID).data("state"),
        TypeID: $("#ticket"+ticketID).data("typeid"),
        CreatedTimestamp: $("#ticket"+ticketID).data("createdtimestamp"),
        ResolvedTimestamp: $("#ticket"+ticketID).data("resolvedtimestamp"),
        finalSolution: $("#ticket"+ticketID).data("finalsolution")
     }, obj => {
        Object.keys(result).forEach(key => {
            // If object key corresponds to a dropdown menu and values haven't been set
            let input = document.querySelector('#view' + key);
            if(("Reporter" == key || "ReporterNo" == key || "AssignedSpecialistID" == key || "SoftwareID" == key
            || "HardwareID" == key) & result[key] == ""){
                input.value = 0;
            } else{
                input.value = result[key];
            }
        });
    });
};


// Close ticket modals when close button is clicked
function closeModal() {
    var createTicketModal = document.getElementById("create-ticket-modal");
    var viewTicketModal = document.getElementById("view-ticket-modal");
    createTicketModal.style.display = "none";
    viewTicketModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target.className == "modal fade" || event.target.className == "modal-form") {
        var createTicketModal = document.getElementById("create-ticket-modal");
        var viewTicketModal = document.getElementById("view-ticket-modal");
        createTicketModal.style.display = "none";
        viewTicketModal.style.display = "none";
    }
}

// When user presses "ESC" on keyboard, close modal
window.onkeydown = (event) => {
    var createTicketModal = document.getElementById("create-ticket-modal");
    var viewTicketModal = document.getElementById("view-ticket-modal");
    if (event.key == "Escape" && (createTicketModal.style.display == "block" || viewTicketModal.style.display == "block")) {
        createTicketModal.style.display = "none";
        viewTicketModal.style.display = "none";
    }
};



/**
 * Sets target data when user starts dragging ticket card
 * 
 * @param {Event} event Event for when user starts dragging ticket card
 */
 function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

/**
 * Prevent browser default actions for when a HTML element is dragged
 * 
 * @param {Event} event Event for when user drags ticket card 
 */
function onDragOver(event) {
    event.preventDefault();
    // Convert event target to correct dropzone
    let dropzone = event.target;
    // If dropzone is table cell
    if (dropzone.tagName == "TD") {
        // Convert dropzone to first child of table cell
        dropzone = dropzone.firstElementChild;
    }
    // While dropzone is not an unordered list (the destination column)
    while (dropzone.tagName != "UL") {
        // Convert dropzone to its parent node
        dropzone = dropzone.parentNode;
    }
}

/**
 * Validate whether ticket move is valid and move ticket to new column, updating ticket state
 * in the database
 * 
 * @param {Event} event Event for when the user drops a ticket card 
 */
function onDrop(event) {
    // If Firefox 1.0+
    if (typeof window["InstallTrigger"] !== 'undefined') {
        alert("Error: Your browser does not support drag and drop.");
        return false;
    }
    if (event.preventDefault) { event.preventDefault(); }
    if (event.stopPropagation) { event.stopPropagation(); }
    // Get ticket ID
    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);

    // Convert event target to correct dropzone
    let dropzone = event.target;
    // If dropzone is table cell
    if (dropzone.tagName == "TD") {
        // Convert dropzone to first child of table cell
        dropzone = dropzone.firstElementChild;
    }
    // While dropzone is not an unordered list (the destination column)
    while (dropzone.tagName != "UL") {
        // Convert dropzone to its parent node
        dropzone = dropzone.parentNode;
    }

    console.log(dropzone);

    // Clear event data
    event.dataTransfer.clearData();

    // Ajax request for getting ticket details
    let ticketID = id.replace('ticket', '');
    $.post('/ticket/onDragOver', result = {ID: $("#ticket"+ticketID).data("id"),
        Description: $("#ticket"+ticketID).data("description"),
        ReporterNo: $("#ticket"+ticketID).data("reporter"),
        AssignedSpecialistID: $("#ticket"+ticketID).data("assignedspecialist"),
        SoftwareID: $("#ticket"+ticketID).data("software"),
        HardwareID: $("#ticket"+ticketID).data("hardware"),
        TicketState: $("#ticket"+ticketID).data("state"),
        TypeID: $("#ticket"+ticketID).data("typeid"),
        NewTicketState: dropzone.dataset.state,
        NewProblemType: dropzone.dataset.typeid,
        finalSolution: $("#ticket"+ticketID).data("finalsolution")
    }, obj => {
        // Reload ticket table
        let ticketDetails = result;
        // If ticket has not been moved
        if (dropzone.dataset.typeid == ticketDetails.TypeID && dropzone.dataset.state == ticketDetails.TicketState) {
            return false;
        }
        // Problem type has been changed
        if (dropzone.dataset.typeid != ticketDetails.TypeID) {
            $.post('/ticket/updateType', results = {ID: $("#ticket"+ticketID).data("id"),
            TypeID: dropzone.dataset.typeid
        }, obj => {
                $("#ticket"+ticketID).data("typeid", dropzone.dataset.typeid);
                console.log(results);
            });
        }
        // Ticket state has not been changed
        if (dropzone.dataset.state == ticketDetails.TicketState) {
            dropzone.appendChild(draggableElement);
        }
        // If ticket is not assigned and destination state is not "TODO"
        else if ((ticketDetails.AssignedSpecialistID == "") && dropzone.dataset.state != 'TODO') {
            // Display error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alertBanner("ERROR: Ticket must have a specialist assigned to move to \"IN PROGRESS\", \"IN REVIEW\" or \"RESOLVED\" columns", "danger");
            return;
        }
            // If ticket has no solution and destination state is "INREVIEW" or "RESOLVED"
        else if (ticketDetails.finalSolution == "" && ["INREVIEW", "RESOLVED"].includes(dropzone.dataset.state)) {
            // Display error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
            alertBanner("ERROR: Ticket must have solution to move to \"IN REVIEW\" or \"RESOLVED\" columns", "danger");
            return;
        }
        // If destination column is "RESOLVED"
        if (dropzone.dataset.state == "RESOLVED") {
            // Ajax query to set resolved time on ticket
            $.post('/ticket/setResolvedDate', result={ ID: $("#ticket"+ticketID).data("id")
            }, obj => {
                $("#ticket"+ticketID).data("resolvedtimestamp", new Date());
                console.log(result);
            });
        }
        else {
            // Ajax query to remove resolved time on ticket
            $.post('/ticket/removeResolvedDate', result={ ID: $("#ticket"+ticketID).data("id")
            }, obj => {
                $("#ticket"+ticketID).data("resolvedtimestamp", "");
                console.log(result);
            });
        }
        // Ajax query to to update ticket state
        $.post('/ticket/updateState', result = {ID: $("#ticket"+ticketID).data("id"),
        TicketState: dropzone.dataset.state
        }, obj => {
            $("#ticket"+ticketID).data("state", dropzone.dataset.state);
            console.log(result);
        });
        // Reload table
        dropzone.appendChild(draggableElement);
    });
}

// When searchbar is focused and key is pressed
function ticketSearch() {
    let search = document.querySelector('#ticket-search').value.toLowerCase();
    let select = document.querySelector('#search-dropdown');
    let selectedOption = select.options[select.selectedIndex].text;
    if (selectedOption == "Reporter"){
        selectedOption = "ReporterName";
    }
    if (selectedOption == "Specialist"){
        selectedOption = "AssignedSpecialistName";
    }
    if (selectedOption == "Hardware"){
        selectedOption = "HardwareName";
    }
    if (selectedOption == "Software"){
        selectedOption = "SoftwareName";
    }
    // Check if "only show assigned" is checked
    let assignedOnly = document.querySelector('#onlyShowAssigned').checked;
    // Get userid
    let userid = $('#only-show-assigned-col').data('username');

    // Get all tickets
    let tickets = document.querySelectorAll('.ticket');
    // If search is empty
    if (search == '') {
        // Redisplay all tickets
        tickets.forEach(ticket => {
            // If only show assigned is checked and user is not assigned to ticket
            if (assignedOnly && !([ticket.dataset['assignedspecialistname'], ticket.dataset['reportername']].includes(userid))) {
                // Hide ticket
                ticket.style.display = 'none';
            } else {
                // Display ticket
                ticket.style.display = 'list-item';
            }
        });
        return false;
    }

    // Loop through tickets
    tickets.forEach(ticket => {
        // If ticket field does not contain search
        if (!ticket.dataset[selectedOption.toLowerCase()]
            || assignedOnly && !(ticket.dataset['assignedspecialistname'] == userid) && !(ticket.dataset['reportername'] == userid)
            || ticket.dataset[selectedOption.toLowerCase()].toString().toLowerCase().indexOf(search) == -1) {
            // Hide ticket
            ticket.style.display = 'none';
        } else {
            if (assignedOnly && ((ticket.dataset['assignedspecialistname'] == userid) || (ticket.dataset['reportername'] == userid)))
                // Display ticket
                ticket.style.display = 'list-item';
        }
    });
}

if (typeof bannerTimeout !== 'undefined'){
    var bannerTimeout;
}
// Displays an error banner with a given message.
function alertBanner(message) {
    // If a banner already exists, remove its content.
    if (document.getElementById("individualAlertBanner")) {
        // Stop the timeout for the existing banner.
        clearTimeout(bannerTimeout);
        document.getElementById("individualAlertBanner").remove();
    }
    // Create content for the new banner.
    var wrapper = document.createElement('div');
    wrapper.innerHTML = '<div id="individualAlertBanner" class="alert-banner"><div>' + message +'</div><button onclick="closeAlert(this)" '
        + 'type="button" class="alert-close button-close" data-bs-dismiss="alert" aria-label="Close">'
        + '<img id="closeBannerButton" src="/images/close.png"></button></div>';

        $( document ).ready(() => {
        // Find the container for the banner and add the new content.
        let alertContainer = document.querySelector('.alertContainer');
        alertContainer.append(wrapper);
        // Start a timeout for the banner to dissapear after 3 seconds.
        bannerTimeout = setTimeout(function(){
            alertContainer.innerHTML = "";
        }, 3000);
    })
}












/**
 * Checks that the inputs on the create-form do not contain injection scripts
 * 
 * @returns true if inputs are valid, false otherwise
 */
function checkCreateForm(showAlert) {
    // Check all inputs for illegal characters
    let form = document.forms["create-form"];
    let valid = true;
    ["ticketDescription", "newCreateTypeText"].forEach(input => {
        if (!validateCharacters(form[input].value)) {
            if (showAlert) {
                alertBanner('ERROR: Illegal character(s) entered in input field.');
                closeModal();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // For each disabled input
            document.querySelector('#problemID').disabled = true;
            valid = false;
            return;
        }
    });
    return valid;
}

/**
 * Checks that the inputs on the update-form do not contain injection scripts
 * 
 * @returns true if inputs are valid, false otherwise
 */
function checkUpdateForm(showAlert) {
    // Check all inputs for illegal characters
    let form = document.forms["update-form"];
    let valid = true;
    ["viewTicketDescription", "newTypeText", "newSolutionText"].forEach(input => {
        if (!validateCharacters(form[input].value)) {
            if (showAlert) {
                alertBanner('ERROR: Illegal character(s) entered in input field.');
                closeModal();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // For each disabled input
            ['#viewResolvedTimestamp', '#viewCreatedTimestamp', '#viewID'].forEach(input => {
                document.querySelector(input).disabled = true;
            });
            valid = false;
            return;
        }
    });
    return valid;
}

/**
 * Check if characters in string are valid and aren't used for script injection
 * 
 * @param {String} string to check characters of 
 * @returns true if string is valid, false otherwise
 */
const validateCharacters = string => !string.match(/[|&;$%@"<>()+]/g);




/**
 * Only show tickets that are assigned to the user
 * 
 * @param {Event} event 
 */
function onlyShowAssigned(event) {
    // Get all tickets
    // Display all tickets
    if (!event.checked) {
        var tickets = $('.ticket').map(function(){
            this.style.display = 'list-item';
        })
        return false;
    }
    // Get userid
    var userid = $('#only-show-assigned-col').data('username');
    // Loop through tickets
    var tickets = $('.ticket').map(function(){
        // If ticket is not assigned to user
        if (!($(this).data('assignedspecialistname') == userid) && !($(this).data('reportername') == userid) ){
            this.style.display = 'none';
        } else {
            this.style.display = 'list-item';
        }
    })
};



