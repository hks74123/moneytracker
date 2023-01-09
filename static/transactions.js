function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('X-CSRFToken');

get_transactions()

async function get_transactions(){
    let response = await fetch('/transactionsapi')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      let share_data = json['data'];
      trans_data = share_data;
      settabledata(share_data)
  }
  else {
      alert("HTTP-Error: " + response.status);
  }

  }
}

function settabledata(data){
    let data_len = data.length;
    const get_main_div = document.getElementById('transtable');
    for (var i=0;i<data_len;i++){
        const chileele = document.createElement('tr');
        get_main_div.appendChild(chileele);
        const spending_cat = document.createElement('th');
        spending_cat.innerText = data[i].spending_category;
        
        const payed_by = document.createElement('th');
        payed_by.innerText = data[i].payed_by.first_name;
        
        const user_list = document.createElement('th');
        const lists = document.createElement('select');
        for(var j=0;j<data[i].users.length;j++){
            const opt = document.createElement('option');
            opt.innerText = data[i].users[j].first_name;
            lists.appendChild(opt);
        }
        user_list.appendChild(lists)
        const date = document.createElement('th');
        date.innerText = data[i].date.split('T')[0];
        const amount = document.createElement('th');
        amount.innerText = data[i].amount;
        const trans_id = document.createElement('th');
        trans_id.innerText = data[i].id;
        const btn = document.createElement('button');
        btn.innerText = 'Update'
        btn.id=`up${data[i].id}`;
        btn.setAttribute('onclick', "update_trans('"+data[i].id+"')");
        const update = document.createElement('th');
        update.appendChild(btn)
        const btn1 = document.createElement('button');
        btn1.innerText = 'Delete'
        btn1.id=`de${data[i].id}`;
        btn1.setAttribute('onclick', "delete_trans('"+data[i].id+"')");
        const update1 = document.createElement('th');
        update1.appendChild(btn1)
        chileele.appendChild(trans_id);
        chileele.appendChild(amount);
        chileele.appendChild(date);
        chileele.appendChild(user_list);
        chileele.appendChild(payed_by);
        chileele.appendChild(spending_cat);
        chileele.appendChild(update)
        chileele.appendChild(update1)
    }
    get_friends()

}

async function get_friends(){
    let response = await fetch('/friendsapi')
    if (response.ok) {
      let json = await response.json();
      let message = json['message'];
      if (message == 'success'){
      let share_data = json['data'];
      setfrienddata(share_data)
  }
  else {
      alert("HTTP-Error: " + response.status);
  }

  }
}

function setfrienddata(data){
    get_sel = document.getElementById('lang');
    get_pay = document.getElementById('pay')
    get_sel.innerHTML=""
    get_pay.innerHTML =""
    for(var i=0;i<data.friends.length;i++){
        const opt = document.createElement('option');
        opt.innerText = data.friends[i].first_name+'('+ data.friends[i].username+')';
        const opt1 = document.createElement('option');
        opt1.innerText = data.friends[i].first_name+'('+ data.friends[i].username+')';
        get_sel.appendChild(opt);
        get_pay.appendChild(opt1);
    }
}


async function createtrans(){

    var selectBoxEl = document.getElementById('lang');
var arrayOfNodes = selectBoxEl.childNodes;
var optionsArr = [];
// loop through child Nodes and only get option nodes
for (var i = 0; i < arrayOfNodes.length; i++) {
	if (arrayOfNodes[i].nodeName === 'OPTION') {
        if(arrayOfNodes[i].selected==true){
  	optionsArr.push(arrayOfNodes[i].value);}
  }
}
    let response = await fetch('transactionsapi', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "users":optionsArr,
            "payed_by":document.getElementById('pay').value,
            "amount":document.getElementById('amount').value,
            "spending_category":document.getElementById('spnd').value
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            window.location.href = '/transactions'
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function update_trans(id){
    document.getElementById('main_div').style.display='none';
    document.getElementById('frm').style.display = 'block'
    for(var i =0;i<trans_data.length;i++){
        if(trans_data[i].id==id){
            break
        }
    }
    let final_data = trans_data[i]
    console.log(final_data)
    ele = document.getElementById('pay')
    ele.innerHTML = ""
    ele1 = document.getElementById('lang')
    ele1.innerHTML = ""
    for (var j=0;j<final_data.users.length;j++){
        const opt = document.createElement('option');
        opt.innerText = final_data.users[j].username
        ele1.appendChild(opt);
    }
        const opt = document.createElement('option');
        opt.innerText = final_data.payed_by.username
        ele.appendChild(opt);
    document.getElementById('amount').value = final_data.amount
    document.getElementById('spnd').value = final_data.spending_category;
    btn = document.getElementById('transsubmit')
    btn.setAttribute('onclick',"updatetrans('"+id+"')")
}


function opencreateform(){
    document.getElementById('main_div').style.display='none';
    document.getElementById('frm').style.display = 'block';
    get_friends();
}

function showtransactions(){
    document.getElementById('main_div').style.display='block';
    document.getElementById('frm').style.display = 'none'
}



async function updatetrans(id){

    var selectBoxEl = document.getElementById('lang');
var arrayOfNodes = selectBoxEl.childNodes;
var optionsArr = [];
// loop through child Nodes and only get option nodes
for (var i = 0; i < arrayOfNodes.length; i++) {
	if (arrayOfNodes[i].nodeName === 'OPTION') {
        if(arrayOfNodes[i].selected==true){
            optionsArr.push(arrayOfNodes[i].value);}
  }
}
    let response = await fetch('transactionsapi', {
        credentials: 'include',
        method: 'PATCH',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id":id,
            "users":optionsArr,
            "payed_by":document.getElementById('pay').value,
            "amount":document.getElementById('amount').value,
            "spending_category":document.getElementById('spnd').value
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            window.location.href = '/transactions'
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}


async function delete_trans(id){
    let response = await fetch('transactionsapi', {
        credentials: 'include',
        method: 'DELETE',
        mode: 'same-origin',
        headers: {
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "id":id,
        })
    })
    if (response.ok) {
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            console.log(message);
            window.location.href = '/transactions'
        }else{
            alert(message);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
