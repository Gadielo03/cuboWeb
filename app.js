// Definición del código del vertex shader como una cadena de texto.
var vertexShaderText = 
[
'precision mediump float;', // Especifica la precisión del punto flotante.
'',
'attribute vec3 vertPosition;', // Atributo de posición del vértice.
'attribute vec2 vertTexCoord;', // Atributo de coordenadas de textura del vértice.
'varying vec2 fragTexCoord;', // Variable para pasar las coordenadas de textura al fragment shader.
'uniform mat4 mWorld;', // Matriz de transformación del mundo.
'uniform mat4 mView;', // Matriz de vista (cámara).
'uniform mat4 mProj;', // Matriz de proyección.
'',
'void main()', // Función principal del shader.
'{',
'  fragTexCoord = vertTexCoord;', // Pasa las coordenadas de textura al fragment shader.
'  gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);', // Calcula la posición final del vértice.
'}'
].join('\n');

// Definición del código del fragment shader como una cadena de texto.
var fragmentShaderText =
[
'precision mediump float;', // Especifica la precisión del punto flotante.
'',
'varying vec2 fragTexCoord;', // Recibe las coordenadas de textura del vertex shader.
'uniform sampler2D sampler;', // Sampler de textura.
'',
'void main()', // Función principal del shader.
'{',
'  gl_FragColor = texture2D(sampler, fragTexCoord);', // Aplica la textura y establece el color del fragmento.
'}'
].join('\n');

// Función de inicialización del demo.
var InitDemo = function () {
	console.log('Mire inge si jala pd. paseme la materia porfa');//Debug para saber si el programa esta funcionando.

	var canvas = document.getElementById('game-surface'); // Obtiene el canvas del HTML.
	var gl = canvas.getContext('webgl'); // Obtiene el contexto WebGL.

	if (!gl) {
		console.log('WebGL not supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
		alert('Your browser does not support WebGL');//Mensaje de error si el navegador no soporta WebGL.
	}

	

	// Configura el color de limpieza y habilita pruebas de profundidad y culling.
	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	// Crea y compila los shaders.
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	// Crea el programa, enlaza los shaders y valida el programa.
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}

	// Define los vértices y los índices del cubo.
	var boxVertices = 
	[ // X, Y, Z           U, V
		// Top
		-1.0, 1.0, -1.0,   0, 0,
		-1.0, 1.0, 1.0,    0, 1,
		1.0, 1.0, 1.0,     1, 1,
		1.0, 1.0, -1.0,    1, 0,

		// Left
		-1.0, 1.0, 1.0,    0, 0,
		-1.0, -1.0, 1.0,   1, 0,
		-1.0, -1.0, -1.0,  1, 1,
		-1.0, 1.0, -1.0,   0, 1,

		// Right
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,   0, 1,
		1.0, -1.0, -1.0,  0, 0,
		1.0, 1.0, -1.0,   1, 0,

		// Front
		1.0, 1.0, 1.0,    1, 1,
		1.0, -1.0, 1.0,    1, 0,
		-1.0, -1.0, 1.0,    0, 0,
		-1.0, 1.0, 1.0,    0, 1,

		// Back
		1.0, 1.0, -1.0,    0, 0,
		1.0, -1.0, -1.0,    0, 1,
		-1.0, -1.0, -1.0,    1, 1,
		-1.0, 1.0, -1.0,    1, 0,

		// Bottom
		-1.0, -1.0, -1.0,   1, 1,
		-1.0, -1.0, 1.0,    1, 0,
		1.0, -1.0, 1.0,     0, 0,
		1.0, -1.0, -1.0,    0, 1,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	// Crea buffers para los vértices y los índices.
	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);

	// Asigna los atributos de posición y coordenadas de textura.
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		positionAttribLocation, // Ubicación del atributo.
		3, // Número de elementos por atributo.
		gl.FLOAT, // Tipo de los elementos.
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Tamaño de un vértice.
		0 // Desplazamiento desde el inicio del vértice hasta este atributo.
	);
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Ubicación del atributo.
		2, // Número de elementos por atributo.
		gl.FLOAT, // Tipo de los elementos.
		gl.FALSE,
		5 * Float32Array.BYTES_PER_ELEMENT, // Tamaño de un vértice.
		3 * Float32Array.BYTES_PER_ELEMENT // Desplazamiento desde el inicio del vértice hasta este atributo.
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(texCoordAttribLocation);

	// Crea y configura la textura.
	var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		document.getElementById('oswi-image') // Imagen usada como textura.
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

	// Especifica el programa a usar.
	gl.useProgram(program);

	// Obtiene las ubicaciones de las matrices uniformes.
	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	// Inicializa las matrices de mundo, vista y proyección.
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

	// Inicializa las matrices de rotación.
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	// Ciclo principal de renderizado.
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI; // Calcula el ángulo de rotación.
		mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]); // Rota en el eje Y.
		mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]); // Rota en el eje X.
		mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix); // Combina las rotaciones.
		gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

		gl.clearColor(0.75, 0.85, 0.8, 1.0); // Limpia la pantalla.
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

		gl.bindTexture(gl.TEXTURE_2D, boxTexture); // Enlaza la textura.
		gl.activeTexture(gl.TEXTURE0);

		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0); // Dibuja el cubo.

		requestAnimationFrame(loop); // Solicita el siguiente cuadro.
	};
	requestAnimationFrame(loop); // Inicia el ciclo de renderizado.
};

//ESTE CODIGO ES PARTE DE UN TUTORIAL DE YOUTUBE EL CUAL SEGUI PERO MODIFIQUE ALGUNAS COSAS, EL USUARIO ES:"Indigo Code"
//ESTE ES EL LINK DE SU GITHUB : "https://github.com/sessamekesh"
//Y CANAL DE YOUTUBE: : "https://www.youtube.com/@IndigoCode"