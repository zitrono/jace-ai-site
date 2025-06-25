import{a as createComponent,d as renderComponent,r as renderTemplate,m as maybeRenderHead}from"./vendor-astro.B249vkud.js";import"kleur/colors";import"html-escaper";import{$ as $$Layout}from"./Layout.Hr3B0FdE.js";import{a as $$Header,$ as $$Section,b as $$Footer}from"./components.DgM8IOcX.js";import{$ as $$Button}from"./primitives.6syxI86g.js";import{$ as $$Newsletter}from"./features.Xe2K3xT-.js";const $$Learn=createComponent(((e,t,r)=>renderTemplate`${renderComponent(e,"Layout",$$Layout,{title:"Learn | Ralph - AI-Native Private Equity Platform"},{default:e=>renderTemplate` ${maybeRenderHead()}<div class="min-h-screen"> ${renderComponent(e,"Header",$$Header,{})} <main id="main" role="main"> <!-- Hero Section --> ${renderComponent(e,"Section",$$Section,{spacing:"md",background:"primary",as:"section",class:"relative"},{default:e=>renderTemplate` <div class="mx-auto max-w-4xl text-center"> <h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl">Learn</h1> <p class="mt-6 text-xl text-gray-300">
Practical guides and insights for PE professionals leveraging AI
</p> </div> `})} <!-- Newsletter CTA --> ${renderComponent(e,"Section",$$Section,{spacing:"sm",background:"primary",as:"section",maxWidth:"lg"},{default:e=>renderTemplate` ${renderComponent(e,"Newsletter",$$Newsletter,{title:"Executive AI Intelligence Brief",subtitle:"Strategic insights and market intelligence for PE decision makers. Weekly analysis of AI adoption trends, competitive intelligence, and implementation best practices.",variant:"enterprise",placeholder:"Enter your business email",buttonText:"Get Insights",countText:"10,000+ PE leaders and LPs receive our brief"})} `})} <!-- Articles Grid --> ${renderComponent(e,"Section",$$Section,{spacing:"lg",background:"primary",as:"section"},{default:e=>renderTemplate` <div class="grid grid-cols-1 lg:grid-cols-3 gap-8"> <!-- Article 1 --> <article class="bg-card rounded-lg p-8 hover:bg-secondary transition-colors"> <h3 class="text-2xl font-bold text-white mb-4">
The Monday Morning AI Routine for Deal Partners
</h3> <p class="text-gray-300 mb-6">
Start your week with AI-powered insights. This practical routine helps partners stay
                ahead of portfolio developments and market movements in just 15 minutes.
</p> <a href="/ralph-web/learn/monday-morning-ai-routine" class="text-yellow-400 font-semibold hover:text-yellow-300">
Read more →
</a> </article> <!-- Article 2 --> <article class="bg-card rounded-lg p-8 hover:bg-secondary transition-colors"> <h3 class="text-2xl font-bold text-white mb-4">
10 Queries Every PE Firm Should Ask Their AI
</h3> <p class="text-gray-300 mb-6">
Discover the most valuable questions that surface hidden opportunities and risks
                across your portfolio. From deal screening to exit planning, these queries transform
                raw data into strategic insights.
</p> <a href="/ralph-web/learn/10-queries-every-pe-firm-should-ask" class="text-yellow-400 font-semibold hover:text-yellow-300">
Read more →
</a> </article> <!-- Article 3 --> <article class="bg-card rounded-lg p-8 hover:bg-secondary transition-colors"> <h3 class="text-2xl font-bold text-white mb-4">
Finding Hidden Risks in 30 Minutes with AI Agents
</h3> <p class="text-gray-300 mb-6">
Learn how autonomous agents can scan thousands of data points to identify emerging
                risks before they impact performance. Real-world examples from portfolio monitoring.
</p> <a href="/ralph-web/learn/finding-hidden-risks-30-minutes" class="text-yellow-400 font-semibold hover:text-yellow-300">
Read more →
</a> </article> <!-- Article 4: PE Data Landscape --> <article class="bg-card rounded-lg p-8 hover:bg-secondary transition-colors"> <h3 class="text-2xl font-bold text-white mb-4">
The Complete PE Data Landscape: What Ralph Sees That Others Miss
</h3> <p class="text-gray-300 mb-6">
Explore the comprehensive 4×5 matrix of PE data sources across all deal stages and security levels. Understand how Ralph transforms 100% of your data into predictive intelligence.
</p> <a href="/ralph-web/learn/pe-data-landscape" class="text-yellow-400 font-semibold hover:text-yellow-300">
Read more →
</a> </article> </div> `})} <!-- CTA Section --> ${renderComponent(e,"Section",$$Section,{spacing:"lg",background:"primary",as:"section"},{default:e=>renderTemplate` <div class="mx-auto max-w-2xl text-center"> <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8">
Ready to see Ralph in action?
</h2> ${renderComponent(e,"Button",$$Button,{variant:"primary",size:"lg",href:"/ralph-web/#"},{default:e=>renderTemplate`Book a Demo`})} </div> `})} </main> ${renderComponent(e,"Footer",$$Footer,{})} </div> `})}`),"/Users/zitrono/dev/web/ralph-web/src/pages/learn.astro",void 0),$$file="/Users/zitrono/dev/web/ralph-web/src/pages/learn.astro",$$url="/ralph-web/learn";export{$$Learn as default,$$file as file,$$url as url};