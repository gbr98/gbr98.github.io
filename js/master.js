let width = window.innerWidth;
let height = window.innerHeight;

window.onload = function(){

	let personal = document.getElementById("personal");
	let professional = document.getElementById("professional");
	let projects = document.getElementById("projects");

	let menuArray = [personal, professional, projects];
	let menuStrArray = ["personal", "professional", "projects"];

	let time = 0;
	let delta;
	let start = new Date();

	function update(){
		
		let now = new Date();
		delta = now - start;
		start = now;
		time += delta*0.001

		width = window.innerWidth;
		height = window.innerHeight;
		dimension = Math.min(width, height);

		let indicator = document.getElementById("indicator")

		if(!$('#mouseClicked').html()){
			menuArray.forEach((item, index) => {
				let offset = 2*index*Math.PI/3;
				let x = Math.cos(time*0.1+offset);
				let y = Math.sin(time*0.1+offset);
				item.style.top = (height/2 + y*(dimension/3) - item.clientHeight/2)+"px";
				item.style.left = (width/2 + x*(dimension/3) - item.clientHeight/2)+"px";
			});

			indicator.style.top = (height/2 - indicator.clientHeight/2)+"px";
			indicator.style.left = (width/2 - indicator.clientHeight/2)+"px";
		} else {
			menuArray[0].style.top = (120-menuArray[0].clientHeight/2)+"px";
			menuArray[0].style.left = (110-menuArray[0].clientHeight/2)+"px";
			menuArray[1].style.top = (120-menuArray[1].clientHeight/2)+"px";
			menuArray[1].style.left = (320-menuArray[1].clientHeight/2)+"px";
			menuArray[2].style.top = (120-menuArray[2].clientHeight/2)+"px";
			menuArray[2].style.left = (530-menuArray[2].clientHeight/2)+"px";
		}
		
		let mouseTracker = document.getElementById("mouseTracker");
		let selectedId = $('#mouseTracker').html(); //|| $('#mouseClicked').html();
		let clickedId = $('#mouseClicked').html();
		if(menuStrArray.indexOf(selectedId) !== -1){
			indicator.style.top = (document.getElementById(selectedId).style.top.slice(0,-2)-10)+"px"
			indicator.style.left = (document.getElementById(selectedId).style.left.slice(0,-2)-10)+"px";
		} else if(menuStrArray.indexOf(clickedId) !== -1){
			indicator.style.top = (document.getElementById(clickedId).style.top.slice(0,-2)-10)+"px"
			indicator.style.left = (document.getElementById(clickedId).style.left.slice(0,-2)-10)+"px";
		}

		if(menuStrArray.indexOf(clickedId) !== -1){
			$("#menuButton").css("display", "unset");
		}		

		//call next update
		window.requestAnimationFrame(update);
	}

	window.requestAnimationFrame(update);
}

$(document).ready(function() {
    $('div').hover(function() { 
    	$('#mouseTracker').html(this.id);
    },function() { 
    	$('#mouseTracker').html("");
    });

    $('.ball').click(function() { 
    	$('#mouseClicked').html(this.id);
    });

    $('.ball').hover(function() {
		$('.indicator-ball').css("width","200px")
		$('.indicator-ball').css("height","200px")
		$('.indicator-ball').css("border-radius","100px")
    },function() {
    	if(!$('#mouseClicked').html()){
    		$('.indicator-ball').css("width","20px")
    		$('.indicator-ball').css("height","20px")
    		$('.indicator-ball').css("border-radius","10px")
    	} else {
    		$('.indicator-ball').css("width","170px")
    		$('.indicator-ball').css("height","170px")
    		$('.indicator-ball').css("border-radius","85px")
    	}
    })

    $('#menuButton').click(function() {
		$('#mouseClicked').html("");
		$('.indicator-ball').css("width","20px")
		$('.indicator-ball').css("height","20px")
		$('.indicator-ball').css("border-radius","10px")
		$(this).css("display", "none")
    })
});

function test(){
	let personal = document.getElementById("personal");
    personal.style.backgroundColor = 'red';
}
