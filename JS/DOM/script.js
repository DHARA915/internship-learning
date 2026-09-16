document.getElementById('first').style.color='green';
x=document.getElementById('first').innerHTML+='This example demonstrates the getElementById'

const divs = document.getElementsByTagName('div');
for (let i = 0; i < divs.length; i++) {
  divs[i].style.color = 'blue';
}


document.getElementById('inn').innerHTML="Subheading"

x=document.getElementById('b1')
document.getElementById('demo').innerHTML="InnerHtml of second paragraph:"+ x.innerHTML


const images = document.getElementsByClassName('image');

for (let i = 0; i < images.length; i++) {
  images[i].onclick = function() {
    this.src = './i2.png';
  };
}

const background=document.getElementsByClassName('box1')

for(let i=0;i<background.length;i++){
    background[i].onclick=function()
    { this.style.backgroundColor="lightblue";

    }
}
// const background = document.getElementsByClassName('box1');

// for (let i = 0; i < background.length; i++) {
//   background[i].onclick = function() {
//     this.style.backgroundColor = 'lightblue';
//   };
// }
