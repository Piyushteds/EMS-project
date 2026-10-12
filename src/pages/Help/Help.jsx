import { BookOpen, MessageCircle, Search, LifeBuoy, ChevronDown, ExternalLink } from "lucide-react";
import PageHeader from "../../components/molecules/PageHeader/PageHeader";
import Button from "../../components/atoms/Button/Button";
import "./Help.css";

const faqs=["How do I add a new employee?","How will the .NET API connect to this frontend?","How does the dashboard calculate statistics?","Where should JWT authentication be configured?","How can I export employee reports?"];

export default function Help(){
  return <>
    <PageHeader title="Help Center" description="Guides, frequently asked questions and integration support."/>
    <div className="help-search"><Search/><input placeholder="Search help articles, APIs, workflows..."/></div>
    <div className="help-cards"><div><BookOpen/><strong>Documentation</strong><p>Learn the EMS modules and frontend architecture.</p><Button variant="secondary">Browse Docs <ExternalLink size={14}/></Button></div><div><MessageCircle/><strong>Contact Support</strong><p>Need help with an implementation or workflow?</p><Button variant="secondary">Start Conversation</Button></div><div><LifeBuoy/><strong>API Integration</strong><p>Understand how services map to your .NET modules.</p><Button variant="secondary">Integration Guide</Button></div></div>
    <div className="faq-card"><h3>Frequently Asked Questions</h3>{faqs.map(q=><button key={q}><span>{q}</span><ChevronDown size={17}/></button>)}</div>
  </>;
}
