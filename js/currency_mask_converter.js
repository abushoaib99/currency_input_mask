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
    // Add new character at the specific index
    if (index > str.length) {
        return str + char; // Append the character if index is out of bounds
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index);
    let newStr = `${firstPart}${char}${lastPart}`
    return newStr;
}

function removeCharAt(str, index) {
    // Remove character from the specific index
    if (index < 0 || index >= str.length) {
        return str; // Return the original string if the position is out of bounds
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index+1);
    let newStr = `${firstPart}${lastPart}`
    return newStr;
}

function focusCursorPosition(cursorPos){
    // Focus cursor at the given cursor postion at input field
    let $this = $(this)[0];
    $this.selectionStart = cursorPos;
    $this.selectionEnd = cursorPos;
    $this.focus();
}

function countDot(str) {
    let cnt = 0;
    for (let char of str) {
        if(char === '.'){
            cnt++;
        }
    }
    return cnt;
}

function isRemovedComma(str1, str2){
    let cnt1 = 0;
    let cnt2 = 0;
    for(let char of str1){
        if(char === ','){
            cnt1++;
        }
    }
    for(let char of str2){
        if(char === ','){
            cnt2++;
        }
    }
    return (cnt1!==cnt2);
}

function makeCurrencyFormat(value){
    /// Make the value into thousand currency format
    let input = $(this);
    value = value.replace(/,/g, ''); // Remove existing commas

    if (value) {
        // Parse the value as a float and format with two decimal places
        let numberValue = value * 1;
        let formattedValue = numberValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        input.val(formattedValue);
    }
    else{
        input.val('0.00');
    }
}

let r = navigator.userAgent;
let o = /mobile/i.test(r);
let s = /iemobile/i.test(r);
let isIphone = /iphone/i.test(r) && !s;
let isAndroid = /android/i.test(r) && !s;
// alert(`r = ${r}, mobile = ${o}, iemobile = ${s}, iPhone = ${isIphone}, android = ${isAndroid}`);


(function(){
    let $amount1 = $('input[type=amount]');
    let $amount2 = $('#amount_2');
    $amount1.css({'text-align': 'right'})
    $amount1.val("0.00");
    let allowKeyPress = [...'0123456789.', 'Backspace', 'ArrowLeft', 'ArrowRight'];

    if (true){
        $amount1.on('click', function(e){
            let cursorPosStart = $(this)[0].selectionStart;
            console.log("cursorPosStart::: ", cursorPosStart);
        });

        let oriValue = null;
        let oriValueLen = null;
        let cursorPosStart = null;
        let cursorPosEnd = null;
        let cursorPos = null;

        $amount1.on('keyup keydown', function(e){
            let pressedKey = e.key;
            let eventType = e.type;
            let value = $(this).val();
            value = value.replace(/[^0-9.,]/g, '');
            let intergerValue = value.replace(/[^0-9.]/g, '').split('.')[0];
            
            if((intergerValue.length>11) 
                && [...'0123456789'].includes(pressedKey)){
                return false;
            }

            if(pressedKey === 'Delete'){
                return false;
            }

            if(eventType === 'keydown'){
                console.log("KEYDOWN_VAL::: ", value);
                oriValue = value;
                oriValueLen = value.length;
                cursorPosStart = $(this)[0].selectionStart;
                cursorPosEnd = $(this)[0].selectionEnd;
                cursorPos = oriValueLen - cursorPosStart;

                let partialSelection = ((cursorPosEnd - cursorPosStart) > 1) && (cursorPosStart !== 0 && cursorPosEnd !== oriValueLen);
    
                if (partialSelection){
                    // Prevent delete partial selected value
                    return false;
                }
                if([...'0123456789'].includes(pressedKey)){
                    // For remove cursor blink from laptop browser
                    return false;
                }

                if(cursorPosStart){
                    /// To delete prevous value of comma
                    let prevCurPos = cursorPosStart-1;
                    let prevChar = value[prevCurPos];
                    if(prevChar === ','){
                        cursorPosStart--;
                    }
                }
            }
            if(eventType === 'keyup'){
                let keyUpValue = $(this).val();
                let keyUpValueLen = keyUpValue.length;
                console.log("KEYUP_THIS_VAL::: ", keyUpValue);

                let cntDot = countDot(keyUpValue);

                if([2, 3].includes(cursorPos)){
                    if(cntDot === 0){
                        /// If comma delete
                        let addIndex = cursorPosStart-1;
                        let removeIndex = cursorPosStart - 2;
                        let newCurPos = cursorPosStart - 1;
                        // Add comma at postion 2 from last digit
                        value = addCharAt(value, addIndex, '.');
                        if(value.length === 4){
                            // replce first digit by `0`
                            value = replaceCharAt(value, removeIndex, '0');
                        }
                        else{
                            // remove first digit
                            value = removeCharAt(value, removeIndex);
                            newCurPos = cursorPosStart - 2;
                        }
                        
                        // Update field by new updated value
                        makeCurrencyFormat.call(this, value);
                        // Move cursor to the after `.` position
                        focusCursorPosition.call(this, newCurPos);
                        return false;
                    }
                }

                if(cntDot > 1 && oriValue !== keyUpValue){
                    // If press `.`, then cursor move to at index 2 from last
                    $(this).val(oriValue);
                    let dotPosition = oriValueLen - 2;
                    // Move cursor to the `.` position
                    focusCursorPosition.call(this, dotPosition);
                    return false;
                }

                if ([0, 1, 2].includes(cursorPos)){
                    /// Action for decimal part value (after `.`)
                    let newCurPos = cursorPosStart;
                    if(oriValueLen > keyUpValueLen){
                        value = replaceCharAt(oriValue, cursorPosStart-1, '0');
                        newCurPos = cursorPosStart - 1;
                    }
                    if([...'0123456789'].includes(pressedKey) && cursorPos !== 0){
                        // Replace digit by presskey of current place
                        newCurPos = cursorPosStart + 1;
                        value = replaceCharAt(value, cursorPosStart, pressedKey);
                    }
                    $(this).val(value);
                    if((newCurPos !== cursorPosStart) || (value !== keyUpValue)){
                        // Move cursor to the next index
                        focusCursorPosition.call(this, newCurPos);
                    }
                }
                else{
                    // Action for integer part value (befor `.`)
                    if([...'0123456789'].includes(pressedKey)){
                        if (cursorPosStart === 0 && oriValueLen === 4){
                            /// Replace first digit by pressed digit for one integer value
                            value = replaceCharAt(value, 0, pressedKey);
                            cursorPosStart++;
                        }
                        else{
                            /// Add the pressed digit at the selected cursor index
                            value = addCharAt(value, cursorPosStart, pressedKey);
                        }
                    }
                    // Get comma is delete or not
                    let isRemComma = isRemovedComma(oriValue, keyUpValue);
                    if(isRemComma){
                        // If back button pressed from comma index,
                        // then removed the previous digit of comma
                        value = removeCharAt(keyUpValue, cursorPosStart-1);
                    }

                    /// Update the input field by new value
                    makeCurrencyFormat.call(this, value);

                    let newValue = $(this).val();
                    
                    let newValueLen = newValue.length;
                    let addLen = newValueLen - oriValueLen;
                    cursorPosStart = cursorPosStart + addLen;
                    cursorPosStart = cursorPosStart < 0 ? 0 : cursorPosStart;

                    console.log("HERE_CURSOR::: ", cursorPosStart, newValue, oriValue, keyUpValue, (newValue === keyUpValue) ,(newValue === oriValue))
                    if(((newValue !== oriValue) || (newValue !== keyUpValue))){
                        /// If input field value changed then move the cursor accordingly
                        focusCursorPosition.call(this, cursorPosStart);
                    }
                }
            }
        })
    }

    else{
        $amount1.on('click', function(e){
            let cursorPosStart = $(this)[0].selectionStart;
            let value = $(this).val();
            let valLen = value?.length;
            let cursorPos = valLen - cursorPosStart;
            console.log("CURSOR_POINT::: ", valLen, cursorPosStart, cursorPos);
    
        });
    
        $amount1.on('keydown', function(e){
            let pressedKey = e.key;
            let pressedKeyCode = e.keyCode;
            let pressedKeyWhich = e.which;
            let pressedCharCode = e.charCode;
            console.log("KEY::: ", pressedKey);
            
            if (allowKeyPress.includes(pressedKey) === false) {
                return false;
            }
            
            let input = $(this)[0];
            let cursorPosStart = input.selectionStart;
            let cursorPosEnd = input.selectionEnd;
            let value = $(this).val();
            // value = value.replace(/[^0-9.]/g, '');
            let valLen = value?.length;
            let cursorPos = valLen - cursorPosStart;
            let dotPosition = valLen - 2;
            console.log("CURSOR_POINT::: ", valLen, cursorPosStart, cursorPos);
            if(isAndroid){
                alert(`${pressedKey}, ${pressedKeyCode}, ${pressedKeyWhich}, ${pressedCharCode}, ${cursorPosStart}`);
            }
            
    
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
            // alert(pressedKey);
    
            makeCurrencyFormat.call(this);
            value = $(this).val();
            let newValLen = value.length;
            let addLen = newValLen - oriValLen;
            addLen = (cursorStart + addLen) < 0 ? 0: addLen;
            let newCurPos = cursorStart + addLen;
            focusCursorPosition.call(this, newCurPos);
            // $(this)[0].selectionStart = cursorStart + addLen;
            // $(this)[0].selectionEnd = cursorStart + addLen;
            return false;
        });
        $amount2.inputmask({alias: "currency", prefix: ''});
        console.log("Amount2", $amount2.val())
    }
}());

