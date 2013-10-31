function start(){
	// The first thing to do is remove the button from the page to avoid multiple clicks.
	document.getElementById('startButton').parentNode.removeChild(document.getElementById('startButton'));

	// We then start the webGL test. When that test is finished, we do everything else.
	// This is easier as the GL takes the longest, and we need the data from it in a simple manor.
	GL('webGL', '250', '250', 'v6');
}
function startRest(glData){
	// We start the other test
	var t1 = test('arial18pt', 'Arial', '18pt');
	var t2 = test('arial20px', 'Arial', '20px');
	var t3 = test('webfont12pt', 'Sirin', '12pt');
	var t4 = test('webfont15px', 'Sirin', '15px');
	var t5 = test('userDefaultFont', 'is not a font spec in the slightest', 'This');
	// the gl-data is in the glData variable.
	
	// We display the data
	document.getElementById('v1').innerHTML="";
	document.getElementById('v1').appendChild(t1[0]);

	document.getElementById('v2').innerHTML="";
	document.getElementById('v2').appendChild(t2[0]);
	
	document.getElementById('v3').innerHTML="";
	document.getElementById('v3').appendChild(t3[0]);
	
	document.getElementById('v4').innerHTML="";
	document.getElementById('v4').appendChild(t4[0]);
	
	document.getElementById('v5').innerHTML="";
	document.getElementById('v5').appendChild(t5[0]);

	
	// Send the data in to the database to see how unique the tester is
	var xmlhttp;
	var response;
	if(window.XMLHttpRequest){ // For IE7+, FF, Chrome, Opera, Safari and those.
		xmlhttp = new XMLHttpRequest();
	}
	else{ // Because IE5 and 6 are stupid.
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function(){
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
			// Since we are getting back a single string but we want an array, we simply split the string and mak it an array!
			var gotBack = xmlhttp.responseText;
			response = gotBack.split(",");

			// Now everything is in an array, but we want to display it in a nice fashion. Eg: 23 / 430
			var r1 = response[1].concat(" / ".concat(response[0]));
			var r2 = response[2].concat(" / ".concat(response[0]));
			var r3 = response[3].concat(" / ".concat(response[0]));
			var r4 = response[4].concat(" / ".concat(response[0]));
			var r5 = response[5].concat(" / ".concat(response[0]));
			var r6 = response[6].concat(" / ".concat(response[0]));
			var rA = response[7].concat(" / ".concat(response[0]));

			// And print it to the user.
			document.getElementById('r1').innerHTML=r1;
			document.getElementById('r2').innerHTML=r2;
			document.getElementById('r3').innerHTML=r3;
			document.getElementById('r4').innerHTML=r4;
			document.getElementById('r5').innerHTML=r5;
			document.getElementById('r6').innerHTML=r6;
			document.getElementById('rA').innerHTML=rA;

		}
	}
	// Make sure to encode the data so we don't loose characters like '+'.
	et1 = encodeURIComponent(t1[1]);
	et2 = encodeURIComponent(t2[1]);
	et3 = encodeURIComponent(t3[1]);
	et4 = encodeURIComponent(t4[1]);
	et5 = encodeURIComponent(t5[1]);
	eglData = encodeURIComponent(glData);

	xmlhttp.open("POST", "database.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("arial18pt="+et1+"&arial20px="+et2+"&webfont12pt="+et3+"&webfont15px="+et4+"&userDefault="+et5+"&webgl="+eglData);
	
	
	
	// Display the results-table.
	document.getElementById('results').style.display='block';
}	


function supportCanvas(){
	return !!document.createElement("canvas").getContext;
}
function supportCanvasText(){
	var c = document.createElement("canvas");
	return (c.getContext && c.getContext('2D'));
}

function test(canvasid, font, size){
	var data = [];
	if(!supportCanvas()){ // Check for canvas support
		data.push(document.createTextNode("No canvas support"));
		data.push("No canvas support");
		return data;
	}
	if(supportCanvasText()){ // Check for canvas canvas text support
		data.push(document.createTextNode("No canvas text support"));
		data.push("No canvas text support");
		return data;
	}

	// Create the canvas element and set it's properties
	var c = document.createElement("canvas");
	c.setAttribute("id",canvasid);
	c.setAttribute("width", 415);
	c.setAttribute("height", 30);

	// Define the font and size for the text and write the text
	var context = c.getContext("2d");
	size += " ";
	var useFont = size.concat(font);
	context.font = useFont;
	context.textBaseline = "top";
	context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: &/c.)", 2, 2);

	// Return the results as an array. [0] is the element so we can show it to the user.[1] is the data-value. 
	data.push(c);
	data.push(c.toDataURL('image/png'));
	return data;
}

// This is for the WebGL-test.
var canvas;
var gl;

var paraPointsBuffer;
var paraNormalPointsBuffer;
var paraTexturePointsBuffer;
var paraPointIndexBuffer;

var paraImage;
var paraTexture;

var mvMatrix;
var shaderProgram;
var vertexPositionAttribute;
var textureCoordAttribute;
var vertexNormalAttribute;
var perspectiveMatrix;

var points;
var numVertices;
var numTrianglePoints;
var toRender;
var normals;


function getData(id){
	var data = document.getElementById(id).toDataURL('image/png');
	return data;
}

//
// start
//
// Called when the canvas is created to get the ball rolling.
//
function GL(id, width, height,place) {
	var data = [];
	if(!supportCanvas()){
		data.push(false)
		data.push("No canvas support")
	}

	var c = document.createElement("canvas");
	c.setAttribute("id", id);
	c.setAttribute("width", width);
	c.setAttribute("height", height);
	document.getElementById(place).innerHTML="";
	document.getElementById(place).appendChild(c);

	canvas = document.getElementById(id);

	data = initWebGL(canvas);      // Initialize the GL context
	
	// Only continue if WebGL is available and working
	
	if (gl) {
		gl.viewportWidth=width;
		gl.viewportHeight=height;

		gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
		gl.clearDepth(1.0);                 // Clear everything
		gl.enable(gl.DEPTH_TEST);           // Enable depth testing
		gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
		
		// Initialize the shaders; this is where all the lighting for the
		
		initShaders();
		
		// Here's where we call the routine that builds all the objects
		// we'll be drawing.
		
		initBuffers();
		
		// Next, load and set up the textures we'll be using.
		initTextures();
		
		var data = [];
		data.push(true);
		data.push("Would be nice if this had the value");	
		return data;
		
		// Draw the scene!
		
	}
	if(!gl){
		document.getElementById(id).parentNode.removeChild(document.getElementById(id));
		document.getElementById(place).innerHTML=data[1];
		startRest(data[1]);
	}

	return data;
}

//
// initWebGL
//
// Initialize WebGL, returning the GL context or null if
// WebGL isn't available or could not be initialized.
//
function initWebGL() {
	gl = null;
	
	try {
		gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true, antialias: true}); 
	}
		catch(e) {
	}
	
	// If we don't have a GL context, give up now
	
	if (!gl) {
		//alert("Unable to initialize WebGL. Your browser may not support it.");
		returnData = "No WebGL support";
		return [false, "No WebGL support"];
	}
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just have
// one object -- a simple two-dimensional cube.
//
function initBuffers() {

	// Create a buffer for the cube's vertices.
	
	paraPointsBuffer = gl.createBuffer();
	
	// Select the paraPointsBuffer as the one to apply vertex
	// operations to from here out.
	
	gl.bindBuffer(gl.ARRAY_BUFFER, paraPointsBuffer);
	
	// Now create an array of vertices for the cube.
	
	points = [];
	var texturePoints = [];
	toRender = [];
	var maxRows = 10;
	var maxCols = 10;
	for(var row = 0; row <= maxRows; row++){
		for(var col = 0; col <= maxCols; col++){
			// This is some mathmagic right here. This gets the coordinates needed to draw a hyperbolic paraboloid.
			var x = (row / maxRows)*6-3;
			var y = (col / maxCols)*6-3;
			var z = (Math.pow(y,2)/2) - (Math.pow(x,2)/3);
			  
			points.push(x);
			points.push(y);
			points.push(z);

			// This is soo we know where to place the texture.
			texturePoints.push(row/maxRows);
			//texturePoints.push(col/maxCols); // Use this if you have a texture that fills the entire picture.

			// Since the picture(texture) we use does not fill out the entire 512x512px space for the pic (we have a lot of whitespace in it) we need to offset it so we only see the intendet portion. This was easier than using a non-power-of-two picture.
			// So we use a little mathamagic to set the picture as we want it.
			var offset = 5192/8192;
			texturePoints.push((1-offset) + (col/maxCols)*offset);
	
		}
	}
	numVertices = points.length / 3;
	
	// Now pass the list of vertices into WebGL to build the shape. We
	// do this by creating a Float32Array from the JavaScript array,
	// then use it to fill the current vertex buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	
	
	

	// Map the texture onto the shape.
	
	paraTexturePointsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, paraTexturePointsBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePoints), gl.STATIC_DRAW);
	
	// Build the element array buffer; this specifies the indices
	// into the vertex array for each face's vertices.
	
	paraPointIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, paraPointIndexBuffer);
	
	// This array splits everything in triangles and defines how the texture should be drawn.	
	var trianglePoints = [];
	for(var row = 0; row<maxRows; row++){
		for(var col = 0; col<maxCols; col++){
			var p1 = col + (row*(maxCols+1));
			var p2 = col + (row*(maxCols+1))+1;
			var p3 = col + ((row+1) * (maxCols+1));
			var p4 = col + ((row+1) * (maxCols+1))+1;

			// This order is sort of strange, but needed for the texture to be drawn correctly.
			trianglePoints.push(p1);
			trianglePoints.push(p3);
			trianglePoints.push(p2);

			trianglePoints.push(p2);
			trianglePoints.push(p3);
			trianglePoints.push(p4);
		}
	}
	// This is needed för GL so it knows how many points it should look for when it draws the texture (see drawScene())
	numTrianglePoints = trianglePoints.length;
	
	// Now send the element array to GL
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(trianglePoints), gl.STATIC_DRAW);
	

	// This is for lightning of the object
	paraNormalPointsBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, paraNormalPointsBuffer);
	
	
	var vertexVectors = [];
	for(var i=0; i<points.length;i +=3){
		var v = vec3.create(points.slice(i,i+3));
		vertexVectors.push(v);
	}

	normals = [];
	for(var p=0; p<numVertices; p++){
		var loc = trianglePoints.indexOf(p);
		var triplet = Math.floor(loc/3)*3;

		var nVertices = trianglePoints.slice(triplet, triplet+3);

		while(nVertices[0] !== p){
			nVertices.push(nVertices.shift());
		}

		var v0 = vertexVectors[nVertices[0]];
		var v1 = vertexVectors[nVertices[1]];
		var v2 = vertexVectors[nVertices[2]];

		var d0 = vec3.create();
		vec3.subtract(v1,v0,d0);
		var d1 = vec3.create();
		vec3.subtract(v2,v0,d1);

		var cross = vec3.create();
		vec3.cross(d0,d1, cross);
		vec3.normalize(cross);

		normals.push(cross[0]);
		normals.push(cross[1]);
		normals.push(cross[2]);
	}

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	
}

//
// initTextures
//
// Initialize the textures we'll be using, then initiate a load of
// the texture images. The handleTextureLoaded() callback will finish
// the job; it gets called each time a texture finishes loading.
//
function initTextures() {
	paraTexture = gl.createTexture();
	paraImage = new Image();
	paraImage.onload = function() { handleTextureLoaded(paraImage, paraTexture); }
	paraImage.src = "iso12233.png";
}

function handleTextureLoaded(image, texture) {
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);
	gl.finish();
	drawScene();
}

//
// drawScene
//
// Draw the scene.
//
function drawScene() {
	gl.finish();
	// Clear the canvas before we start drawing on it.
	
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Establish the perspective with which we want to view the
	// scene. Our field of view is 45 degrees, with a width/height
	// ratio of 640:480, and we only want to see objects between 0.1 units
	// and 100 units away from the camera.
	
	//perspectiveMatrix = makePerspective(45, 512.0/512.0, 0.1, 100.0);
	perspectiveMatrix = makePerspective(45, gl.viewportWidth/gl.viewportHeight, 0.1, 100.0);
	
	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	
	loadIdentity();
	
	// Now move the drawing position a bit to where we want to start
	// drawing the cube.
	
	mvTranslate([-0.0, 0.0, -10.0]);
	
	
	// Draw the cube by binding the array buffer to the cube's vertices
	// array, setting attributes, and pushing it to GL.
	
	gl.bindBuffer(gl.ARRAY_BUFFER, paraPointsBuffer);
	gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
	// Set the texture coordinates attribute for the vertices.
	
	gl.bindBuffer(gl.ARRAY_BUFFER, paraTexturePointsBuffer);
	gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	
	
	// Ligths!
	gl.bindBuffer(gl.ARRAY_BUFFER, paraNormalPointsBuffer);
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

	 
	// Specify the texture to map onto the faces.
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, paraTexture);
	gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

	// Draw the shape.
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, paraPointIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, numTrianglePoints, gl.UNSIGNED_SHORT, 0);
	
	//returnData = canvas.toDataURL('image/png'); // Should set the returnData-value.
	//convertCanvasToImage(canvas);
	
	startRest(canvas.toDataURL('image/png'));


}

function convertCanvasToImage(pic){
	var image = new Image();
	image.src = pic.toDataURL('image/png');
	returnData = pic.toDataURL('image/png');
	//document.getElementById('tt').innerHTML=returnData;
	//document.getElementById('tt1').appendChild(document.createTextNode(returnData));
	//document.body.appendChild(image);
	//return image;
}


//
// initShaders
//
// Initialize the shaders, so WebGL knows how to light our scene.
//
function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	// Create the shader program
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	// If creating the shader program failed, alert
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		//alert("Unable to initialize the shader program.");
		returnData = "No shaders";
	}
	
	gl.useProgram(shaderProgram);
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
	
	textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(textureCoordAttribute);

	vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(vertexNormalAttribute);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	
	// Didn't find an element with the specified ID; abort.
	
	if (!shaderScript) {
		return null;
	}
	
	// Walk through the source element's children, building the
	// shader source string.
	
	var theSource = "";
	var currentChild = shaderScript.firstChild;
	
	while(currentChild) {
		if (currentChild.nodeType == 3) {
			theSource += currentChild.textContent;
		}
	
		currentChild = currentChild.nextSibling;
	}
	
	// Now figure out what type of shader script we have,
	// based on its MIME type.
	
	var shader;
	
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;  // Unknown shader type
	}
	
	// Send the source to the shader object
	
	gl.shaderSource(shader, theSource);
	
	// Compile the shader program
	
	gl.compileShader(shader);
	
	// See if it compiled successfully
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
}

//
// Matrix utility functions
//

function loadIdentity() {
	mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
	multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));

	var normalMatrix = mvMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
	gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
}

var mvMatrixStack = [];

function mvPushMatrix(m) {
	if (m) {
		mvMatrixStack.push(m.dup());
		mvMatrix = m.dup();
	} else {
		mvMatrixStack.push(mvMatrix.dup());
	}
}

function mvPopMatrix() {
	if (!mvMatrixStack.length) {
		throw("Can't pop from an empty matrix stack.");
	}

	mvMatrix = mvMatrixStack.pop();
	return mvMatrix;
}

function mvRotate(angle, v) {
	var inRadians = angle * Math.PI / 180.0;

	var m = Matrix.Rotation(inRadians, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
}
