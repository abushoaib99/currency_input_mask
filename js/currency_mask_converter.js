function replaceCharAt(str, index, newChar) {
    // Replace character at the specific index
    if (index >= str.length) {
        return str; // If index is out of bounds, return original string
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index + 1);
    return `${firstPart}${newChar}${lastPart}`;
}

function addCharAt(str, index, char) {
    // Add new character at the specific index
    if (index > str.length) {
        return str + char; // Append the character if index is out of bounds
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index);
    return `${firstPart}${char}${lastPart}`;
}

function removeCharAt(str, index) {
    // Remove character from the specific index
    if (index < 0 || index >= str.length) {
        return str; // Return the original string if the position is out of bounds
    }
    let firstPart = str.substring(0, index);
    let lastPart = str.substring(index+1);
    return `${firstPart}${lastPart}`;
}

function focusCursorPosition(cursorPos){
    // Focus cursor at the given cursor position at input field
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

function isCommaRemoved(str1, str2){
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
    /// Make the value into a thousand currency format
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

(function(){
    let $amount1 = $('input[type=amount]');
    $amount1.css({'text-align': 'right'})
    $amount1.val("0.00"); // Initial value
    let allowDigit = [...'0123456789'];

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
        let integerValue = value.replace(/[^0-9.]/g, '').split('.')[0];

        if((integerValue.length>11)
            && allowDigit.includes(pressedKey)){
            return false;
        }

        if(pressedKey === 'Delete'){
            return false;
        }

        if(eventType === 'keydown'){
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
            if(allowDigit.includes(pressedKey)){
                // For remove cursor blink from laptop browser
                return false;
            }

            if(cursorPosStart){
                /// To delete previous value of comma
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

            let cntDot = countDot(keyUpValue);

            if(cursorPos === 2 && cntDot === 0){
                /// If `.` (dot) delete
                let addIndex = cursorPosStart-1;
                let removeIndex = cursorPosStart - 2;
                // Add `.` (.) at position 2 from last digit
                value = addCharAt(value, addIndex, '.');
                if(value.length === 4){
                    // replace first digit by `0`
                    value = replaceCharAt(value, removeIndex, '0');
                }
                else{
                    // remove first digit
                    value = removeCharAt(value, removeIndex);
                }
                
                // Update field by new updated value
                makeCurrencyFormat.call(this, value);
                let newCurPos = value.length - 3;
                // Move cursor to the after `.` position
                focusCursorPosition.call(this, newCurPos);
                return false;
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
                    // If digit deleted then replace the previous cursor position value by `0`
                    value = replaceCharAt(oriValue, cursorPosStart-1, '0');
                    newCurPos = cursorPosStart - 1;
                }
                if(allowDigit.includes(pressedKey) && cursorPos !== 0){
                    // Replace digit by pressed key of current place
                    newCurPos = cursorPosStart + 1;
                    value = replaceCharAt(value, cursorPosStart, pressedKey);
                }
                $(this).val(value);
                let valueLen = value.length;
                if((newCurPos !== cursorPosStart) || (value !== keyUpValue)){
                    // Move cursor to the next index
                    focusCursorPosition.call(this, newCurPos);
                }
                if(valueLen < 4){
                    // If delete all digit from cursor start point
                    let newValue = '0.00';
                    let newCurPos = 0;
                    if(cursorPos === 1){
                        newValue = `0.0${value[valueLen-1]}`;
                        newCurPos = 3;
                    }
                    if (cursorPos === 2){
                        newValue = `0.${value[valueLen-2]}${value[valueLen-1]}`;
                        newCurPos = 2;
                    }

                    $(this).val(newValue);
                    focusCursorPosition.call(this, newCurPos);
                }
            }
            else{
                // Action for integer part value (before `.`)
                if(allowDigit.includes(pressedKey)){
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
                // Get comma is deleted or not
                let isCommaRem = isCommaRemoved(oriValue, keyUpValue);
                if(isCommaRem){
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

                if(((newValue !== oriValue) || (newValue !== keyUpValue))){
                    /// If input field value changed then move the cursor accordingly
                    focusCursorPosition.call(this, cursorPosStart);
                }
            }
        }
    })
}());

