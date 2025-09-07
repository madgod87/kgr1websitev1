'use client'

import React from 'react'
import Link from 'next/link'

interface Service {
  id: number
  title: string
  description: string
  icon: string
  color: string
  features: string[]
  externalLink?: string
  internalLink?: string
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      id: 1,
      title: 'Notifications',
      description: 'Latest updates and important notices from the office',
      icon: '📢',
      color: 'from-blue-500 to-blue-600',
      features: ['Stay informed with the latest notifications.'],
      internalLink: '/notifications',
    },
    {
      id: 2,
      title: 'Office Staff Details',
      description: 'View details of office staff members',
      icon: '👨‍💼',
      color: 'from-purple-500 to-purple-600',
      features: ['Know your office staff and their roles.'],
    },
    {
      id: 3,
      title: 'Panchayat Member Details',
      description: 'Information about Panchayat members',
      icon: '👥',
      color: 'from-indigo-500 to-indigo-600',
      features: ['Find details of Panchayat members.'],
    },
    {
      id: 4,
      title: 'Lakshmir Bhander Status Check',
      description: 'Check your Lakshmir Bhander application status',
      icon: '💰',
      color: 'from-green-500 to-green-600',
      features: ['Track your Lakshmir Bhander application.'],
      externalLink: 'https://socialsecurity.wb.gov.in/track-applicant',
    },
    {
      id: 5,
      title: 'Jay-Bangla Pension Status Check',
      description: 'Check your Jay-Bangla Pension application status',
      icon: '🏦',
      color: 'from-purple-500 to-purple-600',
      features: ['Track your Jay-Bangla Pension application.'],
      externalLink: 'https://jaibangla.wb.gov.in/track-applicant-public',
    },
  ]

  return (
    <section id="services" className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide comprehensive government services to citizens of Krishnagar-I Development Block, Nadia District.
            Access various schemes, certificates, and support services through our office.
          </p>
          <div className="mt-8 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform transition-all duration-300 hover:scale-105 animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${service.color} p-4 rounded-xl -mx-6 -mt-6 mb-6`}>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="text-white text-right">
                    <h3 className="text-xl font-bold mb-1">{service.title}</h3>
                    <p className="text-white/80 text-sm">{service.description}</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="space-y-4">
                <div className="text-gray-600 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Available Services:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  {service.externalLink ? (
                    <a
                      href={service.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full block text-center bg-gradient-to-r ${service.color} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                    >
                      Go to Service
                    </a>
                  ) : service.internalLink ? (
                    <Link
                      href={service.internalLink}
                      className={`w-full block text-center bg-gradient-to-r ${service.color} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
                    >
                      View {service.title}
                    </Link>
                  ) : (
                    <button className={`w-full bg-gradient-to-r ${service.color} text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}>
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                Need Assistance?
              </h3>
              <p className="text-xl mb-8 text-white/90">
                Our team is here to help you with all government services and procedures.
                Visit our office or contact us for personalized support at bdo.krishnagar1@gmail.com or 9733374108.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105">
                  Visit Office
                </button>
                <button className="border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services
