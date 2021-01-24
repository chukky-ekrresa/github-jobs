import '../styles/main.scss';
import './job.scss';

import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const params = new URLSearchParams(window.location.search);
const jobId = params.get('job_id');

fetchJob(jobId)
	.then(job => {
		const jobContainer = document.getElementById('job-container');
		const jobTemplate = document.getElementById('job-template').content;

		const jobTitle = jobTemplate.querySelector('.job__title');
		const jobLocation = jobTemplate.querySelector('.job__location');
		const jobDescription = jobTemplate.querySelector('.job__description');
		const jobDate = jobTemplate.querySelector('#job-date');
		const jobType = jobTemplate.querySelector('#job-type');

		const companyImage = jobTemplate.querySelector('.company__image');
		const companyTitle = jobTemplate.querySelector('.company__title');
		const companySite = jobTemplate.querySelector('.company__site');
		const howToApply = jobTemplate.querySelector('.apply__text');

		jobTitle.textContent = job.title;
		companyImage.src = job.company_logo;
		companyTitle.textContent = job.company;
		companySite.href = job.company_url;
		jobLocation.textContent = job.location;
		jobType.textContent = job.type;
		jobDate.textContent = dayjs().to(dayjs(job.created_at));

		jobDescription.innerHTML = HtmlSanitizer.SanitizeHtml(job.description);
		howToApply.innerHTML = HtmlSanitizer.SanitizeHtml(job.how_to_apply);

		jobContainer.appendChild(jobTemplate);
	})
	.catch(err => {
		console.log(err.message);
	});

async function fetchJob(jobId) {
	const response = await fetch(
		`https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions/${jobId}.json`
	);

	const jobData = await response.json();
	return jobData;
}
