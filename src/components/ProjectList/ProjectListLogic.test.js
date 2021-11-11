import {searchProject} from './ProjectListLogic'
const fakeProjectsArray = [
    {name:'Test 10', id:'111'},
    {name:'Test 11', id:'222'},
    {name:'Test 12', id:'333'},
    {name:'Test 13', id:'444'},
    {name:'Test 14', id:'555'},
    {name:'CASE', id:'231'}
]
test('should return expected amount of projects when user types in a search keyword', ()=>{

    const keyword1 = '11'
    const keyword2 = '4'
    const keyword3 = 'Test'

    let result1 = searchProject(fakeProjectsArray, keyword1 )
    let result2 = searchProject(fakeProjectsArray, keyword2 )
    let result3 = searchProject(fakeProjectsArray, keyword3 )

    expect(result1.length).toBe(2)
    expect(result2.length).toBe(2)
    expect(result3.length).toBe(5)    
})
test('should return the matching projects based on the search keyword', () => {
    const keyword1 = '11'

    let result1 = searchProject(fakeProjectsArray, keyword1 )

    expect(result1).toContainEqual({name:'Test 10', id:'111'})
    expect(result1).toContainEqual({name:'Test 11', id:'222'})
   
})
test('should return an empty array when there is no matching results with the search keyword', ()=>{

    const keyword = 'No Matching Test'

    let result = searchProject(fakeProjectsArray, keyword )

    expect(result.length).toBe(0)
})
test('should not be case sensitive', () => {
    const keyword='case'

    let result = searchProject(fakeProjectsArray, keyword)

    expect(result.length).toBe(1)
    expect(result).toContainEqual({name:'CASE', id:'231'})
})
test('should return all projects when search keyword is none/undefined',()=>{
    const keyword1= undefined;
    const keyword2= '';
    const keyword3=null

    let result1 = searchProject(fakeProjectsArray, keyword1 )
    let result2 = searchProject(fakeProjectsArray, keyword2 )
    let result3 = searchProject(fakeProjectsArray, keyword3 )

    expect(result1.length).toBe(fakeProjectsArray.length)
    expect(result2.length).toBe(fakeProjectsArray.length)
    expect(result3.length).toBe(fakeProjectsArray.length)
})