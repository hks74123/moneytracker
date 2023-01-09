
document.getElementById('logn').addEventListener('click',login_check);


async function login_check(){
    document.getElementById('logn').style.display='none';
    document.getElementById("uname").disabled=true;
    document.getElementById("pass").disabled=true;
    document.getElementById('loadin_btn1').style.display='';
    let response = await fetch('/loginuser', {
        credentials: 'include',
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": document.getElementById("uname").value,
            "pass": document.getElementById("pass").value
        })
    })
    if(response.ok){
        let json = await response.json();
        let message = json["message"];
        if(message=='success'){
            window.location.replace('/');
        }
        else{
            document.getElementById("uname").disabled=false;
            document.getElementById("pass").disabled=false;
            document.getElementById('loadin_btn1').style.display='none';
            document.getElementById('logn').style.display='';
            document.getElementById('msgbx').style.display='block';
            document.getElementById('msgbx').innerHTML=message;
        }
    }
    else{
        log='Server time out';
        document.getElementById('msgbx').style.display='block';
        document.getElementById('msgbx').innerHTML=log;
        document.getElementById("uname").disabled=false;
        document.getElementById("upss").disabled=false;
        document.getElementById('loadin_btn1').style.display='none';
        document.getElementById('logn').style.display='';
    }
}