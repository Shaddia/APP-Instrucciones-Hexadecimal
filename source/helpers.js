function checkHex(hex) {
    if (hex.length == 8) {
	return true;
    }
    else {
	return false;
    }
}

function binaryToHex(binaryValue){
    missingBits = binaryValue.length % 4;
    for(i = 0; i < missingBits; i++){
	binaryValue = "0" + binaryValue;
    }
    
    var hexValue = "";
    for(j = 0; j < binaryValue.length; j+=4){
	if(binaryValue.substring(j,j+4).indexOf('X') === -1){
	    hexValue = hexValue + binaryToHexTable[binaryValue.substring(j,j+4)];
	}
	else{
	    hexValue = hexValue + "X";
	}
    }
    return hexValue;
}

function clearField(id) {
    document.getElementById(id).innerHTML = "";
}

function printErrorMessage(errorMessage) {
    document.getElementById("res_title").innerHTML = "Error";
    document.getElementById("res_msg").innerHTML = errorMessage;
}

function hexCleaner(hex){
    hex = hex.trim();
    if (hex.charAt(0) == 'x' || hex.charAt(0) == 'X'){
        hex = hex.substring(1);
        }
        else if(hex.charAt(1) == 'x' || hex.charAt(1) == 'X'){
        hex = hex.substring(2);
        }
    return hex;
}

function searchInstruction(instruction){
    instruction = instruction.replace(/\.([^\.]*)$/, ".fmt");

    var symbol = instruction.replace(".", "").toUpperCase();
    var symbolFound = 0;
    var instructionObject = {};

    for(i = 0; i < instructions.length; i++){
	if(instructions[i].symbol.replace(".", "").toUpperCase() == symbol){
	    instructionObject = instructions[i];
	    symbolFound = 1;
	    break;
	}
    }

    if(symbolFound == 0){
	var errorMessage = "Error: Instruccion invalida";
	printErrorMessage(errorMessage);
    }

    return instructionObject;
}

function searchIns(bin){ 
    var instructionObject = {};
    var opcode = bin.substring(0,6);
    if (opcode == "000000"){	
	var funct = bin.substring(26,33);
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits[(instructions[i].bits.length)-1][3] == funct
	       && instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    else if (opcode == "000001"){
	var regimm = bin.substring(11,16);
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits.length >= 3
	       && instructions[i].bits[2][3] == regimm
	       && instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    else {
	for(i = 0; i < instructions.length; i++){
	    if(instructions[i].bits[0][3] == opcode){
		instructionObject = instructions[i];
		break;
	    }
	}
    }
    return instructionObject;
}

