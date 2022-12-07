import { Link } from "react-router-dom"

function NavBar() {
    return (
        <div id="nav-bar">
            <Link to='/' className="nav-bar-link"> New Game </Link>
            <Link to='/save' className="nav-bar-link"> Save Game </Link>
            <Link to='/load' className="nav-bar-link"> Load Game </Link>
            <Link to='/user' className="nav-bar-link"> Profile </Link>
        </div>
    )
}

export default NavBar