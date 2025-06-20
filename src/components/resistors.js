/* eslint-disable eqeqeq */
function Connection(first, second, parellel){
    this.first = first;
    this.parellel = parellel;
    this.second = second;
    
}
function Fraction(numerator, denominator)
{
    const divisor = euclides(numerator, denominator);
    return {
    numerator:numerator/divisor,
    denominator:denominator/divisor}
}
function euclides(num1, num2)
{
    let first = Math.max(num1-0, num2);
    let second = Math.min(num1-0, num2);
    if(num1==0||num2==0)
    {
        return 1;
    }
    while(first%second!=0)
    {
        first = [second, second=first%second][0];
    }
    return second;
}
function toString(foo){
    return `${foo.numerator}/${foo.denominator}`;
}
/**
 * 
 * @param {String} foo
 * @returns {Fraction}
 */
function fromString(foo){
    let arr = foo.split("/");
    return new Fraction(arr[0], arr[1]?arr[1]:"1");
}
function parellel(r1,r2)
{
    const R1 = fromString(r1);
    const R2 = fromString(r2);
    // console.log(r1, r2);
    return Fraction(R1.numerator*R2.numerator, R1.numerator*R2.denominator+R2.numerator*R1.denominator);
}
function serial(r1,r2){
    const R1 = fromString(r1);
    const R2 = fromString(r2);
    // console.log(r1, r2);
    return Fraction(R1.numerator*R2.denominator+R2.numerator*R1.denominator, R1.denominator*R2.denominator);
}
function goBackReccur(G, index)
{
    const value = G[index];
    if(!value)
    {
        return index;
    }
    return new Connection(goBackReccur(G, value.first), goBackReccur(G, value.second), value.parellel);
}
/**
 * 
 * @param desired 
 * @param {Array} resistors  
 */
export function solve(desired, resistors)
{
    const recipes = {}
    let G = [], beforeG = [], isRunning = true;
    desired = desired.indexOf("/")==-1?desired+"/1":desired;
    resistors.forEach(i=>{
        G.push(i);
        beforeG.push(i);
        recipes[i] = null;
    });
    while(isRunning)
    {
        let newG = [];
        for(const r of G)
        {
            for(const resistance of beforeG)
            {
                const Serial = serial(r, resistance);
                const s = toString(Serial);
                const Parellel = parellel(r,resistance);
                const p = toString(Parellel);
                if(!(s in recipes))
                {
                    recipes[s] = new Connection(r, resistance, false);
                    newG.push(s);
                }
                isRunning = s != desired;
                if(!(p in recipes))
                {
                    recipes[p] = new Connection(r,resistance, true);
                    newG.push(p);
                }
                isRunning = (p !=desired)&&isRunning;
                if(!isRunning){break;}
            }
            if(!isRunning){break;}
        }
        beforeG = newG;
    }
    return JSON.stringify(goBackReccur(recipes,desired));
}