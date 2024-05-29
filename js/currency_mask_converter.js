function replaceCharAt(str, index, newChar) {
    if (index >= str.length) {
        return str; // If index is out of bounds, return original string
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index + 1);
    let newStr = `${firstPart}${newChar}${lastPart}`
    return newStr;
}

function addCharAt(str, index, char) {
    if (index > str.length) {
        return str + char; // Append the character if index is out of bounds
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index);
    let newStr = `${firstPart}${char}${lastPart}`
    newStr = removeLeadingZeros(newStr);
    return newStr;
}


function removeLeadingZeros(str) {
    return str.replace(/^0+/, '') || '0';
}

function focusCursorPosition(cursorPos){
    // $(this)[0].setSelectionRange(cursorPos, cursorPos);
    $(this)[0].selectionStart = cursorPos;
    $(this)[0].selectionEnd = cursorPos;
}

function makeCurrencyFormat(){
    let input = $(this);
    let value = input.val().replace(/,/g, ''); // Remove existing commas

    if (value) {
        // Parse the value as a float and format with two decimal places
        let numberValue = parseFloat(value);
        let formattedValue = numberValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        console.log("FORMTVAL::: ", formattedValue)
        input.val(formattedValue);
    }
}


(function(){
    // let $amount = $('input[type=amount]');
    let $amount1 = $('#amount_1');
    let $amount2 = $('#amount_2');
    $amount1.css({'text-align': 'right'})
    $amount1.val("0.00");
    let allowKeyPress = [...'0123456789.', 'Backspace', 'ArrowLeft', 'ArrowRight'];

    $amount1.on('click', function(e){
        let cursorPosStart = $(this)[0].selectionStart;
        let value = $(this).val();
        let valLen = value?.length;
        let cursorPos = valLen - cursorPosStart;
        console.log("CURSOR_POINT::: ", valLen, cursorPosStart, cursorPos);

    });

    $amount1.on('keydown', function(e){
        let pressedKey = e.key;
        console.log("KEY::: ", pressedKey)
        if (allowKeyPress.includes(pressedKey) === false) {
            return false;
        }
        
        let input = $(this)[0];
        let cursorPosStart = input.selectionStart;
        let cursorPosEnd = input.selectionEnd;
        let value = $(this).val();
        let valLen = value?.length;
        let cursorPos = valLen - cursorPosStart;
        let dotPosition = valLen - 2;
        console.log("CURSOR_POINT::: ", valLen, cursorPosStart, cursorPos);

        if(allowKeyPress.includes(pressedKey)){
            let moveLeft = cursorPosStart - 1;
            let moveRight =  cursorPosStart + 1;
            let returnValue = true;
            if(pressedKey === 'Backspace'){
                let isAllTextSelected = cursorPosStart === 0 && cursorPosEnd === valLen;

                if (isAllTextSelected){
                    $(this).val('0.00');
                    focusCursorPosition.call(this, 0);
                    return false;
                }

                let replacePos = cursorPosStart - 1;

                if ([0, 1].includes(cursorPos)){
                    // For 1st and 2nd cursor positon from left
                    // Replace by `0` of 0, 1 index value
                    let newValue = replaceCharAt(value, replacePos, '0');
                    $(this).val(newValue);
                    focusCursorPosition.call(this, moveLeft);
                    returnValue = false;
                }
                else if([2, 3].includes(cursorPos) && valLen === 4){
                    // For 3rd and 4th cursor positon from left and value length is 4
                    // Replace first character by `0` of 4 length string
                    let newValue = replaceCharAt(value, 0, '0');
                    $(this).val(newValue);
                    focusCursorPosition.call(this, moveLeft);
                    returnValue = false;
                }
                else if (cursorPos === 2 && valLen > 4){
                    // For 3rd cursor positon from left and value length greater than 4
                    focusCursorPosition.call(this, moveLeft);
                }
                else{
                    if(cursorPosStart){
                        let prevChar = value[cursorPosStart-1];
                        console.log("CURSOR_START_BACKSPACE::: ", cursorPosStart)
                        if(prevChar === ','){
                            $(this)[0].selectionStart = cursorPosStart - 1;
                            $(this)[0].selectionEnd = cursorPosStart - 1;
                        }
                    }
                }
                
                return returnValue;
            }
            else if ([...'0123456789'].includes(pressedKey)){
                if (cursorPos === 0){
                    return false;
                }
    
        
                if ([1, 2].includes(cursorPos)){
                    // For decimal value
                    let newValue = replaceCharAt(value, cursorPosStart, pressedKey);
                    $(this).val(newValue);
                    focusCursorPosition.call(this, moveRight);
                    returnValue = false;
                }
                else if ([3, 4].includes(cursorPos) && value[0] === '0'){
                    // Replace first character by `0` of 4 length string
                    let newValue = replaceCharAt(value, 0, pressedKey);
                    $(this).val(newValue);
                    focusCursorPosition.call(this, 1);
                    returnValue = false;
                }
                else{
                    if (cursorPos === valLen && pressedKey === '0'){
                        // Return for 1st character `0`
                        return false;
                    }
    
                    let newValue = addCharAt(value, cursorPosStart, pressedKey);
                    let replacedValue = newValue.replace(/[^0-9.]/g, '');
                    let replaceValueLen = replacedValue.length;
                    if(replaceValueLen > 18){
                        return false;
                    }
                    $(this).val(newValue);
                    let newCurPos = cursorPosStart + 1;
                    focusCursorPosition.call(this, newCurPos);
                    returnValue = false;
                }
                return returnValue;
            }
            else if(pressedKey === '.'){
                focusCursorPosition.call(this, dotPosition);
                return false;
            }
        }
    });

    $amount1.on("keyup paste", function(e){
        let pressedKey = e.key;
        if(allowKeyPress.includes(pressedKey) === false){
            return false;
        }

        let value = $(this).val();
        let cursorStart = $(this)[0].selectionStart;
        let oriValLen = value.length;
        value = value.replace(/[^0-9.]/g, '');
        
        makeCurrencyFormat.call(this);
        value = $(this).val();
        let newValLen = value.length;
        let addLen = newValLen - oriValLen;
        addLen = (cursorStart + addLen) < 0 ? 0: addLen;
        $(this)[0].selectionStart = cursorStart + addLen;
        $(this)[0].selectionEnd = cursorStart + addLen;
        return false;
    });
    $amount2.inputmask({alias: "currency", prefix: ''});
    console.log("Amount2", $amount2.val())
}())