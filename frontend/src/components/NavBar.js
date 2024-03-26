import {ReactComponent as Logo} from './The_University_of_Alabama_Logo.svg';  

export default function Navbar() {     
    
    return <nav className="nav">         
    <Logo with="50" height="50" className="alabamaLogo"/>         
    <a href="/" className="site"> CS Scheduler Login</a>         
    {/* <ul>             
        <li>                 
            <a href="/student">Student</a>             
            </li>             
            <li>                 
                <a href="/professor">Professor</a>             
                </li>         
                </ul>      */}
                </nav> 
                }