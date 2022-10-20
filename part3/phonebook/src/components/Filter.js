const Filter = ({searchName, setSearchName}) => {
    const handleSearchName = (e) => setSearchName(e.target.value)

    return <p>filter shown with <input value={searchName} onChange={handleSearchName} /></p>
}
export default Filter