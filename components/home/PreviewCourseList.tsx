import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { SCHEDULES, ADVANCED_COURSE_SCHEDULES } from '../../constants';
export default function PreviewCourseList() {
  const foundation = SCHEDULES.find(s => !s.registrationClosed && !s.interestOnly && (s.slotsLeft === undefined || s.slotsLeft > 0));
  const advanced = ADVANCED_COURSE_SCHEDULES.find(s => !s.registrationClosed);
  const courses = [
    {category:'Foundation (2-Day)', title:'Agentic AI Foundations for Non-Technical Professionals', description:'A 2-day course on the basics and practical no-code workflows for everyday work. No coding required.', duration:'16 hours · In person', dates:foundation?.dates || 'Register interest for the next intake', fee:'S$113.03', path:'/courses/agentic-ai/'},
    {category:'3-Day Course', title:'Agentic AI-Driven Business Innovation for Productivity', description:'An accessible 3-day course for anyone who wants more hands-on time and depth beyond the basics. No coding or prior AI course required.', duration:'3 days · In person', dates:advanced?.dates || 'Register interest for the next intake', fee:'S$190.50', path:'/courses/advanced-agentic-ai/'}];
  return <section id="courses" className="academy-course-comparison academy-container"><div className="academy-section-intro"><h2>Find the right course for you</h2><p>The 2-day Foundation course covers the basics and practical no-code workflows. The 3-day course is an accessible next step for anyone who wants more hands-on time and depth, with no coding required.</p></div>
    <div className="academy-course-rows">{courses.map(course => <article key={course.path} className="academy-course-row" aria-label={course.title}>
      <div className="academy-course-story"><p className="academy-course-kicker">{course.category}</p><h3><Link to={course.path}>{course.title}</Link></h3><p>{course.description}</p><p className="academy-course-trainer">Trainer: Melverick Ng</p></div>
      <dl className="academy-course-logistics"><div><dt>Format</dt><dd>{course.duration}</dd></div><div><dt>Next intake</dt><dd>{course.dates}</dd></div></dl>
      <div className="academy-course-decision"><dl><dt>Fee from</dt><dd>{course.fee}<small>including GST*</small></dd></dl><p className="academy-small">*For eligible enhanced-funded learners. See course page for eligibility and full fees.</p><Link className="academy-action" to={course.path}>Explore {course.category} <ArrowUpRight size={18} aria-hidden="true"/></Link></div>
    </article>)}</div>
    <div className="academy-private-course-note"><p>Planning a private class for your team?</p><Link to="/private-class/" className="academy-text-link">Explore private classes <ArrowUpRight size={18} aria-hidden="true" /></Link></div>
  </section>;
}
