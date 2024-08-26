function getTypedInstructionBits(instructionObject, typedInstruction){

    var regexRegisters = /^(\$([0-9a-z])+|[a-z]([0-9a-z])*)$/g;
    var regexNumbers = /^0x([0-9a-f])+$/g;

    var format = instructionObject.format;
    format = format.replace(/\[[^\]]+\]/g, ''); 
    format = format.replace(/,/g, ' '); 
    format = format.replace(/\(/g, ' '); 
    format = format.replace(/\)/g, ' '); 

    var formatPieces = format.replace(/\s+/g,' ').trim().split(' ');
    var instructionPieces = typedInstruction.replace(/\s+/g,' ').trim().split(' ');

    if(instructionPieces.length != formatPieces.length) return null;

    for(i = 1; i < instructionPieces.length; i++){ 

	if(instructionPieces[i].match(regexRegisters) != null){
	    if(formatPieces[i].match(/(rd|rs|rt|base)/) == null) return null; 
	    if(typeof registerToBinary[instructionPieces[i]] === 'undefined') return null; 
	    continue;
	}

	if(instructionPieces[i].match(regexNumbers) != null){
	    if(formatPieces[i].match(/(immediate|offset|cop_fun|sa|target|hint|index)/) == null) return null;
	    continue;
	}
	return null; 
    }

    var typedInstructionBits = [];

    for(i = 0; i < instructionObject.bits.length; i++){

	typedInstructionBits[i] = [];
	typedInstructionBits[i][0] = instructionObject.bits[i][0];
	typedInstructionBits[i][1] = instructionObject.bits[i][1];
	typedInstructionBits[i][2] = instructionObject.bits[i][2];

	if(instructionObject.bits[i][3] != ""){
	    typedInstructionBits[i][3] = instructionObject.bits[i][3];
	}
	else{
	    var binaryValue = "";
	    var position = -1;
			
	    for(j = 0; j < formatPieces.length; j++){
		if(formatPieces[j] == instructionObject.bits[i][2]) position = j;
	    }

	    if(position == -1){
		for(j = 0; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
		    binaryValue = binaryValue + "X";
		}
	    }
	    else{
		var typedField = instructionPieces[position]; 

		for(j = 0; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
		    binaryValue = binaryValue + "0";
		}

		if(typedField.match(regexNumbers) != null){
		    var binaryNumber = "";

		    for(j = typedField.length - 1; j >= 0 && typedField[j] != 'x'; j--){
			binaryNumber = hexTable[typedField[j]] + binaryNumber;
		    }

		    for(j = binaryNumber.length; j < instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1; j++){
			binaryNumber = "0" + binaryNumber;
		    }

		    binaryValue = binaryNumber.substring(binaryNumber.length - (instructionObject.bits[i][0] - instructionObject.bits[i][1] + 1), binaryNumber.length);
		}

		if(typedField.match(regexRegisters) != null){
		    binaryValue = registerToBinary[typedField]; 
		    typedInstructionBits[i][2] = typedField;
		}
	    }
	    typedInstructionBits[i][3] = binaryValue;
	}
    }
    return typedInstructionBits;
}

function itohex() {
    document.getElementById("res_title").innerHTML = "Resultado";
    
    var typedInstruction = document.getElementById("inst").value;
    typedInstruction = typedInstruction.toLowerCase();
 
    typedInstruction = typedInstruction.replace(/,/g, ' '); 
    typedInstruction = typedInstruction.replace(/\(/g, ' '); 
    typedInstruction = typedInstruction.replace(/\)/g, ' '); 
    typedInstruction = typedInstruction.trim(); 
    typedInstruction = typedInstruction.replace(/\s{2,}/g, ' '); 
    var typedInstructionSymbol = typedInstruction.split(' ')[0].toUpperCase();

    var instructionObject = searchInstruction(typedInstructionSymbol);

    if(typeof instructionObject.format === 'undefined'){
	printErrorMessage("Error: Instruccion invalida");
	return;
    }

    var typedInstructionBits = getTypedInstructionBits(instructionObject, typedInstruction);
    if(typedInstructionBits == null){
    	document.getElementById("res_title").innerHTML = "Error";
    	document.getElementById("res_msg").innerHTML = "Error: Instruccion en el formato equivocado";
	return;
    }

    var result = "";
    result += "<h1>Instruccion: " + typedInstruction + "</h1>";
    var bin = "";
    for(j = 0; j < typedInstructionBits.length; j++){
	bin += typedInstructionBits[j][3];
    }

    result += "<h3>Binario: " + bin + "</h3>";
    result += "<h3>Hex: 0x" + binaryToHex(bin) + "</h3>"; 
    document.getElementById("res_msg").innerHTML = result;
}