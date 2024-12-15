const infixToFunction={
    '*':(x,y)=>x*y,
    '/':(x,y)=>x/y,
    '+':(x,y)=>x+y,
    '-':(x,y)=>x-y
}
const infixEval=(regex,str)=>str.replace(regex,(_match,arg1,infix,arg2)=>infixToFunction[infix](parseFloat(arg1),parseFloat(arg2)));
const highPrecedence=(str)=>
{
    const regexForTheInfixDivideMultiply=/([\d]+)([*\/])([\d]+)/g
   let str2=infixEval(regexForTheInfixDivideMultiply,str)
    return str===str2 ? str2 : highPrecedence(str2)

}
const isEven=num=>num%2===0;
const sum=nums=>nums.reduce((acc,el)=>acc+el,0);
const average=nums=>sum(nums)/nums.length;
const median=nums=>{
    const length=nums.length
    const mid=Math.floor(length/2);
    return isEven(length) ?  average([nums[mid-1],nums[mid]]) 
    : nums[mid]
}
const range=(start,end)=>Array(end-start+1).fill(start).map((el,index)=>el+index)
const charRange=(char1,char2)=>range(char1.charCodeAt(),char2.charCodeAt()).map(el=>String.fromCharCode(el))
const spreadsheetFunctions={
isEven,
sum,
average,
median,
even:nums=>nums.filter(isEven),
someeven:nums=>nums.some(isEven),
everyeven:nums=>nums.every(isEven),
firsttwo:nums=>nums.slice(0,2),
lasttwo:nums=>nums.slice(-2),
has2: nums=>nums.includes(2),
increment:nums=>nums.map(el=>el+1),
random:([x,y])=>Math.floor(Math.random()*(y-x)+x),
range:nums=>range(...nums),
nodupes:nums=>([... new Set(nums).values()])
}
const applyFunction=(str)=>
{
    const noHigh=highPrecedence(str);
    const infix=/([\d.]+)([+-])([\d.]+)/g
    const str2=infixEval(infix,noHigh)
    const functionRegex=/([a-z0-9]+)\(([\d., ]*)\)(?!.*\()/g;
    const toNumberList=args=>args.split(',').map(parseFloat)
    return  str2.replace(functionRegex,(match,fn,args)=>spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? spreadsheetFunctions[fn](toNumberList(args)): match)
}
const evalFormula=(value,cells)=>{
   const idToText=id=>cells.find(cell=>cell.id===id.toUpperCase()).value==''? 0 : cells.find(cell=>cell.id===id.toUpperCase()).value;
   const rangeRegex=/([a-j])([1-9][0-9]?):([a-j])([1-9][0-9]?)/i
   const rangeFromString=(num1,num2)=>range(Number(num1),Number(num2))
   const elemValue=num=>char=>idToText(char+num)
   const addCharacters=char1=>char2=>num=>charRange(char1,char2).map(elemValue(num))
   const rangeExpanded=value.replace(rangeRegex,(_match,char1,number1,char2,number2)=>rangeFromString(number1,number2).map(addCharacters(char1)(char2)))
   console.log(rangeExpanded)
   const cellRegex=/[a-j][1-9][0-9]?/ig
   const cellExpanded=rangeExpanded.replace(cellRegex,match=>idToText(match.toUpperCase()))
   const functionExpanded=applyFunction(cellExpanded)
   return functionExpanded===value ? functionExpanded : evalFormula(functionExpanded,cells)
}
window.onload=()=>
{
    const container=document.querySelector('.container')
    createLabel=(theInsideOne)=>{
     const label=document.createElement('div');
     label.className="label"

     label.textContent=theInsideOne
     container.appendChild(label)
    }
    charRange('A','J').forEach(createLabel)
    range(1,99).forEach(num=>{
        createLabel(num)
        charRange('A','J').forEach(char=>
        {
            const input=document.createElement('input');
            input.id=char+num;
            input.type="text"
            input.ariaLabel=char+num;
            input.onchange=update;
            container.appendChild(input)
        }
        )
    })
}
const update=event=>{
const theCell=event.target
const value=theCell.value.replace(/\s/g,'')
if(value.startsWith('=') && !theCell.value.includes(theCell.id))
{
 theCell.value= evalFormula(value.slice(1),Array.from(theCell.parentElement.children))
}
}

