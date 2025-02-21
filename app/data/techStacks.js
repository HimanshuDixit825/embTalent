export const techStacks = {
    frontend: {
        title: "Frontend Development",
        description: "Select your preferred frontend technology stack to get started.",
        sections: [
            {
                title: "JavaScript Frameworks",
                items: [
                    { label: 'React', imageSrc: '/React.png', href: '/frontend/react', category: 'Framework' },
                    { label: 'Next.js', imageSrc: '/next.svg', href: '/frontend/nextjs', category: 'Framework' },
                    { label: 'Vue', imageSrc: '/Vue.png', href: '/frontend/vue', category: 'Framework' },
                    { label: 'Angular', imageSrc: '/Angular.png', href: '/frontend/angular', category: 'Framework' }
                ]
            },
            {
                title: "Core Technologies",
                items: [
                    { label: 'HTML', imageSrc: '/HTML.png', href: '/frontend/html', category: 'Core' },
                    { label: 'CSS', imageSrc: '/CSS3.png', href: '/frontend/css', category: 'Core' },
                    { label: 'JavaScript', imageSrc: '/Javascript.png', href: '/frontend/javascript', category: 'Core' },
                    { label: 'TypeScript', imageSrc: '/TypeScript (1).png', href: '/frontend/typescript', category: 'Core' }
                ]
            },
            {
                title: "Libraries",
                items: [
                    { label: 'jQuery', imageSrc: '/jQuery.png', href: '/frontend/jquery', category: 'Library' }
                ]
            }
        ]
    },
    backend: {
        title: "Backend Development",
        description: "Select your preferred backend technology stack to get started.",
        sections: [
            {
                title: "Languages & Runtimes",
                items: [
                    { label: 'Node.js', imageSrc: '/Nodejs (2).png', href: '/backend/nodejs', category: 'Runtime' },
                    { label: 'Python', imageSrc: '/Python.png', href: '/backend/python', category: 'Language' },
                    { label: 'Java', imageSrc: '/Java.png', href: '/backend/java', category: 'Language' },
                    { label: 'Go', imageSrc: '/GO.png', href: '/backend/go', category: 'Language' },
                    { label: 'PHP', imageSrc: '/PHP.png', href: '/backend/php', category: 'Language' },
                    { label: 'C#', imageSrc: '/C-sharp.png', href: '/backend/csharp', category: 'Language' },
                    { label: 'Ruby', imageSrc: '/Ruby.png', href: '/backend/ruby', category: 'Language' }
                ]
            },
            {
                title: "Frameworks",
                items: [
                    { label: '.NET', imageSrc: '/microsoft-dotnet 1.png', href: '/backend/dotnet', category: 'Framework' },
                    { label: 'Rails', imageSrc: '/Rails.png', href: '/backend/rails', category: 'Framework' }
                ]
            }
        ]
    },
    fullstack: {
        title: "Full Stack Development",
        description: "Select your preferred full stack technology combination to get started.",
        sections: [
            {
                title: "Stack Based",
                items: [
                    { label: 'MERN Stack', imageSrc: '/Mern.png', href: '/fullstack/mern', category: 'stack' },
                    { label: 'MEAN Stack', imageSrc: '/Mean.png', href: '/fullstack/mean', category: 'stack' }
                ]
            },
            {
                title: "Frontend Technologies",
                items: [
                    { label: 'React', imageSrc: '/React.png', href: '/fullstack/react', category: 'frontend' },
                    { label: 'Next.js', imageSrc: '/next.svg', href: '/fullstack/nextjs', category: 'frontend' },
                    { label: 'Vue', imageSrc: '/Vue.png', href: '/fullstack/vue', category: 'frontend' },
                    { label: 'Angular', imageSrc: '/Angular.png', href: '/fullstack/angular', category: 'frontend' }
                ]
            },
            {
                title: "Backend Technologies",
                items: [
                    { label: 'Node.js', imageSrc: '/Nodejs (2).png', href: '/fullstack/nodejs', category: 'backend' },
                    { label: 'Python', imageSrc: '/Python.png', href: '/fullstack/python', category: 'backend' },
                    { label: 'Java', imageSrc: '/Java.png', href: '/fullstack/java', category: 'backend' },
                    { label: 'Go', imageSrc: '/GO.png', href: '/fullstack/go', category: 'backend' }
                ]
            }
        ]
    }
};
