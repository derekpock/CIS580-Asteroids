!function(t){var e={};function i(s){if(e[s])return e[s].exports;var h=e[s]={i:s,l:!1,exports:{}};return t[s].call(h.exports,h,h.exports,i),h.l=!0,h.exports}i.m=t,i.c=e,i.d=function(t,e,s){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var h in t)i.d(s,h,function(e){return t[e]}.bind(null,h));return s},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";i.r(e);class s{constructor(t,e,i,s){this.x=t,this.y=e,this.width=i,this.height=s}}let h,n,a,r={forward:0,backward:0,left:0,right:0,shift:0,interact:0,space:0,enter:0,escape:0},o=1,l=0,c={x:0,y:0},u=[],d=!1;function f(t,e){let i=u[e];return void 0==i&&(i=new g(e),u[e]=i),i.getDimensions(t)}function y(){let t,e,i=window.innerWidth,s=window.innerHeight,r=n/i,l=a/s;r<1&&l<1?(o=1,t=n,e=a):r>l?(o=r,t=i,e=a/r):(o=l,e=s,t=n/l),h.style.width=t+"px",h.style.height=e+"px",h.style.left=(i-t)/2+"px",h.style.top=(s-e)/2+"px"}function w(t,e){switch(t){case"w":case"W":r.forward=e;break;case"a":case"A":r.left=e;break;case"s":case"S":r.backward=e;break;case"d":case"D":r.right=e;break;case"f":case"F":r.interact=e;break;case" ":r.space=e;break;case"Shift":r.shift=e;break;case"Enter":r.enter=e;break;case"Escape":r.escape=e;break;default:return!1}return!0}function g(t){this.text=t,this.dimensionsByFont=[]}g.prototype.getDimensions=function(t){let e=this.dimensionsByFont[t];if(void 0==e){let i=document.getElementById("textWidthTester");i.style.font=t,i.innerText=this.text,e={width:i.clientWidth+1,height:i.clientHeight+1},this.dimensionsByFont[t]=e}return e};class p extends s{constructor(t){super(0,0,5,5),this.angle=0,this.active=!1,this.velocity=.55,this.fillStyle=t}init(t,e,i){this.x=t,this.y=e,this.angle=i,this.active=!0}logic(t){this.active&&(this.x+=this.velocity*Math.cos(this.angle)*t,this.y+=this.velocity*Math.sin(this.angle)*t,(this.x+this.width<0||this.x-this.width>n||this.y+this.height<0||this.y-this.height>a)&&(this.active=!1))}draw(t){this.active&&(t.fillStyle=this.fillStyle,t.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height))}}function v(t,e){let i=t.x-e.x,s=t.y-e.y;return i*i+s*s<=e.radius*e.radius}const x=300,m=150;class M extends s{constructor(t,e,i,s,h){super(t,e,i,s),this.velocity=.5,this.bullets=[];for(let t=0;t<x;t++)this.bullets.push(new p("yellow"));this.nextBullet=0,this.fireDelay=0,this.asteroids=h,this.lives=3,this.score=0,this.laserShootSound=new Audio("sounds/LaserShoot.wav"),this.playerCrashSound=new Audio("sounds/PlayerCrash.wav")}logic(t){for(let e=0;e<this.bullets.length;e++){let i=this.bullets[e];if(i.active){i.logic(t);for(let t=0;t<this.asteroids.length;t++)if(v(i,this.asteroids[t])){let e=this.asteroids[t].separate();null!=e?this.asteroids.push(e):this.asteroids.splice(t,1),i.active=!1,this.score++;break}}}for(let t=0;t<this.asteroids.length;t++)if(v(this,this.asteroids[t])){this.lives--,this.asteroids.splice(t,1),this.playerCrashSound.play();break}if(r.forward&&(this.y-=this.velocity*t),r.backward&&(this.y+=this.velocity*t),r.left&&(this.x-=this.velocity*t),r.right&&(this.x+=this.velocity*t),this.x+this.width<0?this.x=n+this.width:this.x-this.width>n&&(this.x=-this.width),this.y+this.height<0?this.y=a+this.height:this.y-this.height>a&&(this.y=-this.height),this.fireDelay-=t,1&l&&this.fireDelay<=0){let t=0;for(;t<x&&this.bullets[this.nextBullet].active;)t++,this.nextBullet++,this.nextBullet>=x&&(this.nextBullet=0);if(t!==x){let t=Math.atan2(c.y-this.y,c.x-this.x);this.bullets[this.nextBullet].init(this.x,this.y,t),this.fireDelay=m,this.laserShootSound.cloneNode(!0).play()}}}draw(t){this.bullets.forEach(function(e){e.active&&e.draw(t)}),t.fillStyle="red",t.fillRect(this.x-this.width/2,this.y-this.height/2,this.width,this.height)}}const b=25,S=60;class E extends s{constructor(t,e,i,s,h){let n=Math.sqrt(i);super(t,e,n,n),this.radius=n,this.mass=i,this.velocity=s,this.angle=h}logic(t){this.x+=this.velocity*Math.cos(this.angle)*t,this.y+=this.velocity*Math.sin(this.angle)*t,this.x+this.radius<0?this.x=n+this.radius:this.x-this.radius>n&&(this.x=-this.radius),this.y+this.radius<0?this.y=a+this.radius:this.y-this.radius>a&&(this.y=-this.radius)}draw(t){t.fillStyle="gray",t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.fill()}separate(){if(this.mass<2*S+b)return null;{let t=(this.mass-b)/2,e=1.414213562*this.velocity,i=2*this.radius,s=this.angle+Math.PI/2,h=this.angle-Math.PI/2,n=new E(this.x+i*Math.cos(s),this.y+i*Math.sin(s),t,e,s);return this.x+=i*Math.cos(h),this.y+=i*Math.sin(h),this.mass=t,this.radius=Math.sqrt(this.mass),this.width=this.radius,this.height=this.radius,this.velocity=e,this.angle=h,n}}}let k,A,P,B,D=document.getElementById("canvas"),L=document.createElement("canvas"),F=L.getContext("2d"),I=!1,O=[],T=!1,j=new Audio("sounds/AsteroidCollide.wav");function q(t){I||(L.width=n,L.height=a,A=!0),void 0!==t&&null!==t&&(k=t),P=new M(n/2,a/2,10,10,O=[]),B=0,I||(I=!0,requestAnimationFrame(_))}function C(t){if(1===r.escape&&(A=!A),A);else{if(P.lives>0?(1===r.interact&&(P.x=Math.random()*n,P.y=Math.random()*a),P.logic(t)):1===r.enter&&q(null),0===O.length){B++;for(let t=0;t<2*B;t++){let t=0,e=0;0===2*Math.random()?(t=Math.random()*n,e=999999999*Math.random()):(t=999999999*Math.random(),e=Math.random()*a),O.push(new E(t,e,250*Math.random()*B+S,.1*Math.random()+.1,2*Math.random()*Math.PI))}}O.forEach(function(e){e.logic(t)}),function(t,e){let i=[];return t.forEach(function(t){e.forEach(function(e){if(t!==e){let s=e.x-t.x,h=e.y-t.y,n=e.radius+t.radius;s*s+h*h<n*n&&i.push({first:t,second:e})}})}),i}(O,O).forEach(function(t){!function(t,e){let i=Math.atan2(e.y-t.y,e.x-t.x);t.angle-=i,e.angle-=i;let s=t.velocity*Math.sin(t.angle),h=e.velocity*Math.sin(e.angle),n=t.velocity*Math.cos(t.angle),a=e.velocity*Math.cos(e.angle),r=(t.mass*n+2*e.mass*a-e.mass*n)/(t.mass+e.mass),o=n+r-a;t.angle=Math.atan2(s,r),e.angle=Math.atan2(h,o),t.velocity=Math.sqrt(r*r+s*s),e.velocity=Math.sqrt(o*o+h*h)}(t.first,t.second),j.play()})}2&l&&!T?(O.push(new E(c.x,c.y,1e3*Math.random()+10,.1*Math.random()+.1,2*Math.random()*Math.PI)),T=!0):2&~l&&(T=!1)}function R(t,e,i,s,h,n){t.fillStyle=i,t.font=e,t.fillText(s,h,a+n)}function W(t,e,i,s,h,r){let o=f(e,s);t.fillStyle=i,t.font=e,t.fillText(s,(n-o.width)/2+h,(a-o.height)/2+r)}function _(t){let e=t-k;k=t,requestAnimationFrame(_),C(e),function(){for(let t in r)1===r[t]&&(r[t]=2)}(),function(t){t.fillStyle="#222222",t.fillRect(0,0,n,a),P.lives>0?(R(t,"40pt Monospace","white","Score: "+P.score,5,-10),R(t,"40pt Monospace","white","Lives: "+P.lives,5,-55),R(t,"40pt Monospace","white","Level: "+B,5,-100),P.draw(t)):(W(t,"60pt Arial","white","Game Over",0,0),W(t,"40pt Arial","white","Press Enter to Restart",0,40)),O.forEach(function(e){e.draw(t)}),A&&(t.fillStyle="rgba(0, 0, 0, 0.5)",t.fillRect(0,0,n,a),W(t,"60px Arial","white","Press Escape to "+(0===B?"Begin":"Resume"),0,-100),W(t,"40px Arial","white","WASD To Move",0,100),W(t,"40px Arial","white","Mouse Move/Click to Fire",0,140),W(t,"40px Arial","white","Warp Ship with F",0,180))}(F),D.getContext("2d").drawImage(L,0,0)}!function(t){d?console.log("Error: Game info init called more than once. Ignoring."):(n=(h=t).width,a=h.height,y(),window.addEventListener("resize",y),window.addEventListener("keydown",function(t){w(t.key,1)&&t.preventDefault()}),window.addEventListener("keyup",function(t){w(t.key,0)&&t.preventDefault()}),window.addEventListener("mousedown",function(t){l=t.buttons}),window.addEventListener("mouseup",function(t){l=t.buttons}),window.addEventListener("contextmenu",function(t){t.preventDefault()}),h.addEventListener("mousemove",function(t){c.x=(t.clientX-h.offsetLeft)*o,c.y=(t.clientY-h.offsetTop)*o}),d=!0)}(D),requestAnimationFrame(q)}]);