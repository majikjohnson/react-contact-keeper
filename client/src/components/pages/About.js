import React from 'react'

const About = () => {
    return (
        <div>
            <h1>About</h1>
            <p className="my-1">
                Mern stack app for storing contact, based on Udemy course created by <a href="https://traversymedia.com/">Brad Traversy</a>.
            </p>
            <p className="my-1">
                I have also build test infrastructure for Express and the React app.  See the repository on <a href="https://github.com/majikjohnson/react-contact-keeper">GitHub</a>
            </p>
            <p className="my-1">
                App is tested tested and deployed to Heroku via Travis CI, using full CI/CD pipeline.
            </p>
            <p className="bg-dark p">
                Version: 0.1.0
            </p>
        </div>
    )
} 

export default About
