# Activity: You used AI

## Part 1

[My Conversation](https://claude.ai/share/e424fc12-a0c0-48b0-8f94-a2da28442e73)

## Part 2

I used Claude in my project to help inform my approach toward building my components as well as helping me in CSS styling and creating dynamic animations of these components upon interaction with them. I also used it to help me fill some knowledge gaps about user authentication and other miscellanious tasks.

In general, I mainly used it to help me get started on my components because I believe that there were a lot of underlying javascript structures that I'm not too familiar with, which meant that I would have used StackOverflow or similar to help me find other user-generated code. Thus, by using Claude, I get a more personalized answer that is able to help inform my more targeted approach through my prompting. While I didn't bulk copy the code, having samples that I could see helped me choose certain parts to include and copy small sections of AI generated code that I thought would be ideal in my project. It also helped me understand how useEffect and click behavior integrates into a typical JavaScript project, which alongside regular Googling, allowed me to build a structure that I believe has sound structure and follows normal button and overlay behavior.

It also helped me with integration into CSS styling. I would say I have very little knowledge of CSS, which means that a style table that is purely designed by my own knowledge with the help of StackOverflow would have been very not appealing. Thus, I used Claude to help understand some of the typical usages, especially how they integrated into the HTML through the use of classes. In general, AI was able to help me inform my project much better, since there were a lot of parts of it that would have been exponentially harder without its help.

## Part 3

I think giving it the limited context of building a pokedex web app, the AI was able to infer a decent amount of the project's structure, which allowed it to return type formatting, consistent component rendering based on certain conditions, as well as states, effects, and functions that work on being clicked by the user. Based on the information I gave, this is a very satisfactory response, since it was able to anticipate everything that I might need, and while it gave me a lot of generated code, I thought this was helpful since I got a lot of examples of ways the code could look. In general, I don't believe it hallucinated any details, and the response required heavy editing while I was integrating into my own codebase, since many of the responses felt sometimes too complex or even unecessary. 

## Part 4

Something that I was slightly unfamiliar with during the start of the project is the use of boolean commands within a react return structure. Instead of standard if-statements, Claude was suggesting the use of `(isOpen && <Component>)` sort of structure, which after doing some research, I realized this is a very modern and useful way of writing React code, since it concisely tells the compiler to only include the component if the `isOpen` variable is true. 

Another thing that I was unfamiliar with was the use of .env.local files to store my private token in my code. In python, there is a set package, called dotenv that allows for this easy access, and Claude allowed me to discover a parallel usage here to load our token into the code base upon compile. This allowed the code to run and access the Pokemon database. Thus, I discovered the usage of `const token = import.meta.env.VITE_API_TOKEN;` to import tokens from the local environment.
