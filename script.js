function main() {
    //gets the users
    var root = 'https://jsonplaceholder.typicode.com';
    const get_user1 = $.getJSON(root + '/users/1');
    const get_user2 = $.getJSON(root + '/users/2');
    const get_album_user1 = $.getJSON(root + '/albums?userId=1');
    const get_album_user2 = $.getJSON(root + '/albums?userId=2');
    $('.loading').toggle();
    $.when(get_user1, get_user2).done(function (user1, user2) {
        $(".title:eq(0)").text(user1[0]["name"]);
        $(".title:eq(1)").text(user2[0]["name"]);
    });
    $.when(get_album_user1, get_album_user2).done(function (albums_by_id_1, albums_by_id_2) {
        const albums_id_1 = albums_by_id_1[0];
        const albums_id_2 = albums_by_id_2[0];
        //loops through the album of the first user
        //using the information provided to append new rows to the first table
        for (album of albums_id_1) {
            /*  creates a div like this:
            *   <div class="row" style="order:id of album" draggable="true" id="id of album">
            *   <span class="id_column">id of album</span><span class="album_title_column">title of album</span>
            *   </div>
            *   And attaches it to the first table
            */
            let node_row_div = document.createElement("div");
            node_row_div.className = "row";
            node_row_div.id = album["id"];
            //uses the flexbox order attribute to keep the album list sorted
            node_row_div.style.order = album["id"];
            //makes row draggable
            node_row_div.draggable = "true";
            //adds the information for when you drag a row
            //adds the ondragstart for html
            node_row_div.addEventListener('dragstart', function (ev) {
                ev.dataTransfer.setData("text", ev.target.id);
                ev.dropEffect = "move";
            });
            //adds a custom HTML5 data attribute to store userId of the element
            node_row_div.setAttribute('userId', album["userId"])
            let node_span_id = document.createElement("span");
            const textnode_id = document.createTextNode(album["id"]);
            let node_span_title = document.createElement("span");
            const textnode_title = document.createTextNode(album["title"]);
            node_span_id.className = "id_column";
            node_span_title.className = "album_title_column";
            node_span_id.appendChild(textnode_id);
            node_span_title.appendChild(textnode_title);
            node_row_div.appendChild(node_span_id);
            node_row_div.appendChild(node_span_title);
            $('.table:eq(0)').append($(node_row_div));
        }
        //loops through the album of the second user
        //using the information provided to append new rows to the second table
        for (album of albums_id_2) {
            let node_row_div = document.createElement("div");
            node_row_div.className = "row";
            node_row_div.id = album["id"];
            //Sets the order css from flexbox so after rows are dragged
            //it stays sorted
            node_row_div.style.order = album["id"];
            //adds the information when you drag a row
            node_row_div.draggable = "true";
            node_row_div.addEventListener('dragstart', function (ev) {
                ev.dataTransfer.setData("text", ev.target.id);
                ev.dropEffect = "move";
            });
            //adds a custom HTML5 data attribute to store userId of the element
            node_row_div.setAttribute('userId', album["userId"])
            let node_id = document.createElement("span");
            const textnode_id = document.createTextNode(album["id"]);
            let node_title = document.createElement("span");
            const textnode_title = document.createTextNode(album["title"]);
            node_id.className = "id_column";
            node_title.className = "album_title_column";
            node_id.appendChild(textnode_id);
            node_title.appendChild(textnode_title);
            node_row_div.appendChild(node_id);
            node_row_div.appendChild(node_title);
            $('.table:eq(1)').append($(node_row_div));
        }
    });

    $('.loading').toggle();
}
//Functions for the drag and drop
function allowDrop(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
}
//What to do when the row is dropped into a table
//indicated in html by the ondrop
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    let et = ev.target;
    if (ev.target.className === "album_title_column" || ev.target.className === "id_column") {
        let data_userId = ev.target.parentElement.getAttribute('userid');
        et = et.parentElement.parentElement;
        document.getElementById(data).setAttribute("userId", data_userId);
        update_and_get_data(data_userId, et);
    }
    else if (ev.target.parentElement === "row") {
        let data_userId = ev.target.getAttribute('userid');
        et = et.parentElement;
        document.getElementById(data).setAttribute("userId", data_userId);
        update_and_get_data(data_userId, et);
    }
    //Uses a closure to get the current data and updates it
    function update_and_get_data(data_userId, et) {
        update_data = {
            "userId": Number(data_userId),
            "id": Number(data),
            "title": document.getElementById(data).children[1].innerText
        };
        update(update_data, et);
    }
}
/*
* Updates the api and uses the response to get the new data
*/
function update(data_to_send, et) {
    let root = 'http://jsonplaceholder.typicode.com/albums/';
    $('.loading').toggle();
    $.ajax(root + data_to_send["id"], {
        method: 'PUT',
        data: {
            userId: data_to_send["userId"],
            title: data_to_send["title"]
        }
    }).then(function (data) {
        console.log('Response data from put')
        console.log(data);
        //Uses the response to get the new data
        document.getElementById(data['id']).id = data['id'];
        document.getElementById(data['id']).style.order = data["id"];
        document.getElementById(data['id']).setAttribute('userid', data['userId']);
        document.getElementById(data['id']).children[0].innerText = data['id'];
        document.getElementById(data['id']).children[1].innerText = data['title'];
        et.appendChild(document.getElementById(data['id']));
        //updates the order for the coloring
        updateColor();
        $('.loading').toggle();
        return data;
    });
}
/*
* Sorts the rows of the table so the coloring stays intact
*/
function updateColor() {
    //Gets all the divs inside the first two tables
    let rows1 = $('.table:eq(0) .row');
    let rows2 = $('.table:eq(1) .row');
    //sorts rows of table 1
    rows1.sort(function (a, b) {
        let contentA = parseInt($(a).css('order'));
        let contentB = parseInt($(b).css('order'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });
    //sorts rows of table2
    rows2.sort(function (a, b) {
        let contentA = parseInt($(a).css('order'));
        let contentB = parseInt($(b).css('order'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });
    //appends them
    let myTable1 = $('.table:eq(0)');
    let myTable2 = $('.table:eq(1)');
    $.each(rows1, function (index, item) {
        myTable1.append(item);
    });
    $.each(rows2, function (index, item) {
        myTable2.append(item);
    });
}
$(document).ready(main);