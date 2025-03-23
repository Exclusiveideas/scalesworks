import { BookOpen, FileCode, FileText, MessageSquare, Mic, Search, Shield, TrendingUp } from 'lucide-react';
import './allFeatures.css';
import FeatureBlock from './featureBlock';

const allFeatures = [
  {
    name: 'E-Discovery',
    desc: 'Go through files in seconds.',
    Icon: () => <Search />
  },
  {
    name: 'Legal Research',
    desc: 'Find relevant case law in minutes instead of hours.',
    Icon: () => <BookOpen />
  },
  {
    name: 'Document Review',
    desc: 'Eliminate mistakes and flag risks in your conntract in seconds.',
    Icon: () => <FileText />
  },
  {
    name: 'Document Drafting Automation',
    desc: 'Document automation that is actually intuitive. No more spending time on annoying templates.',
    Icon: () => <FileCode />
  },
  {
    name: 'AI Transcription',
    desc: 'High-accuracyy transcription for depositions, meetings, and recordings.',
    Icon: () => <Mic />
  },
  {
    name: 'Chat With Your Knowledge Base',
    desc: 'Eliminate doubts and save time at all levels of your practice with AI that knows your company.',
    Icon: () => <MessageSquare />
  },
  {
    name: 'Enterprise Security',
    desc: 'Military-grade encryption ensuring complete data protection and compliance',
    Icon: () => <Shield />
  },
  {
    name: 'Measurable Growth',
    desc: 'Increase your billable hours and client satisfaction in 30 days or less. Guaranteed',
    Icon: () => <TrendingUp />
  },
]

const AllFeatures = () => {
  return (
    <div className='allFeatures_wrapper'>
      <h2 className="allFeatures_header">Increase productivity across your team with the first complete AI legal Assistant</h2>
      <p className="allFeatures_subHeader">All features in <span>ONE</span> tool</p>
      <div className="allFeatures_allTools">
        {allFeatures?.map((feature, i) => (
          <FeatureBlock key={i} feature={feature} />
        ))}
      </div>
    </div>
  )
}

export default AllFeatures