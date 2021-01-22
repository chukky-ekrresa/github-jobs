import './styles/main.scss';

import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

async function fetchJobs() {
	const response = await fetch(
		'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json'
	);

	const jobs = await response.json();
	return jobs;
}

fetchJobs()
	.then(jobs => {
		const jobsContainer = document.getElementById('jobs');
		const jobsLoader = document.getElementById('jobs-loader');
		const body = document.getElementById('homepage');
		const jobTemplate = document.getElementById('job-template');
		const jobsFragment = document.createDocumentFragment();

		jobs.forEach(job => {
			const clone = document.importNode(jobTemplate.content, true);

			const jobDate = clone.querySelector('#job-date');
			const jobType = clone.querySelector('#job-type');
			const jobLink = clone.querySelector('.job-url');

			const cardTitle = clone.querySelector('.card__title');
			const cardCompany = clone.querySelector('.card__company');
			const cardImage = clone.querySelector('.card__tag');
			const cardLocation = clone.querySelector('.card__location');

			cardTitle.textContent = job.title;
			cardCompany.textContent = job.company;
			cardImage.src = job.company_logo;
			cardLocation.textContent = job.location;
			jobType.textContent = job.type;
			jobDate.textContent = dayjs().to(dayjs(job.created_at));
			jobLink.href = job.url;

			jobsFragment.appendChild(clone);
		});

		body.removeChild(jobsLoader);
		jobsContainer.appendChild(jobsFragment);
	})
	.catch(err => {
		console.log(err.message);
	});
