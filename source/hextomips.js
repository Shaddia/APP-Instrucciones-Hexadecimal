function hex2bin(hex){
    hex = hex.toLowerCase();
    var out = "";
    for(var i = 0; i < hex.length; i++) {
        switch(hex[i]) {
            case '0': out += "0000"; break;
            case '1': out += "0001"; break;
            case '2': out += "0010"; break;
            case '3': out += "0011"; break;
            case '4': out += "0100"; break;
            case '5': out += "0101"; break;
            case '6': out += "0110"; break;
            case '7': out += "0111"; break;
            case '8': out += "1000"; break;
            case '9': out += "1001"; break;
            case 'a': out += "1010"; break;
            case 'b': out += "1011"; break;
            case 'c': out += "1100"; break;
            case 'd': out += "1101"; break;
            case 'e': out += "1110"; break;
            case 'f': out += "1111"; break;
            default: return "";
        }
    }

    return out;
}

function hexToBin(hex){
    if (checkHex(hex) == true) {
	ret = hex2bin(hex);
	if (ret.length < 32){
	    printErrorMessage("Error: Input incorrecto");
	}
	else{
	    return ret;
	}
    }
    else {
	printErrorMessage("Error: Numero incorrecto de bits");
    }
}

function hextoi(){
    document.getElementById("res_title").innerHTML = "Resultado";

    const hex = document.getElementById("hex").value;
    const bin = hexToBin(hexCleaner(hex));
    
    const insObj = searchIns(bin);

    if(typeof insObj.format === 'undefined'){
        const msg = "Error: Instruccion invalida";
        printErrorMessage(msg); 
	    return;
    }
    
    var bits = [];
    for(i = 0; i < insObj.bits.length; i++){ 
	bits[i] = [];
	bits[i][0] = insObj.bits[i][0]; 
	bits[i][1] = insObj.bits[i][1]; 

	if(insObj.bits[i][3] == ""){
	    bits[i][3] = bin.substring(32 - insObj.bits[i][0] - 1, 32 - insObj.bits[i][1]); 
	}
	else{
	    bits[i][3] =  insObj.bits[i][3]; 
	}

	// get field name
	if(insObj.bits[i][2].match(/(rd|rs|rt|base)/) == null){
	    bits[i][2] = insObj.bits[i][2];
	}
	else{
	    bits[i][2] = registerTable[bits[i][3]];
	}
    }

    var format = insObj.format;
    format = format.replace(/\[[^\]]+\]/g, ''); 
    format = format.replace(/,/g, ' '); 
    format = format.replace(/\(/g, ' '); 
    format = format.replace(/\)/g, ' '); 

    var formatPieces = format.replace(/\s+/g,' ').trim().split(' ');

    for(i = 1; i < formatPieces.length; i++){
	for(j = 0; j < bits.length; j++){
	    if(insObj.bits[j][2] == formatPieces[i]){
		if(formatPieces[i].match(/(rd|rs|rt|base)/) != null){
		    formatPieces[i] = bits[j][2];
		}
		else{
		    formatPieces[i] = "0x" + binaryToHex(bits[j][3]);
		}
	    }
	}
    }

    clearField("res_msg");
    var result = "";
    result += "<h1> Instruccion: " + formatPieces.join(' ') + "</h1>";
    result += "<h3>Binario: " + bin + "</h3>";
    result += "<h3>Hex: " + hex + "</h3>";
    document.getElementById("res_msg").innerHTML = result;
}