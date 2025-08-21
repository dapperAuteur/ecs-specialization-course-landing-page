import React from 'react'

function CourseCurriculum() {

  const lectures = [
    {
      number: "01",
      title: "The Cannabis Mystery",
      description: "Why humans have cannabis receptors and the 1990s discovery that changed medicine",
      duration: "18 min"
    },
    {
      number: "02", 
      title: "Your Body's Hidden Network",
      description: "Where CB1 and CB2 receptors live and why cannabis affects memory, appetite, and pain",
      duration: "20 min"
    },
    {
      number: "03",
      title: "Nature's Messengers", 
      description: "Anandamide and 2-AG - your body's natural cannabis chemicals made on-demand",
      duration: "22 min"
    },
    {
      number: "04",
      title: "The Cleanup Crew",
      description: "FAAH and MAGL enzymes that control how long your natural cannabis signals last",
      duration: "21 min"
    },
    {
      number: "05",
      title: "The Communication System",
      description: "Retrograde signaling - the revolutionary backward brain communication discovery",
      duration: "23 min"
    }
  ];
  return (
    <div className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Curriculum</h2>
              <p className="text-xl text-gray-600">5 comprehensive lectures building your ECS expertise</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {lectures.map((lecture, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold">
                        {lecture.number}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{lecture.title}</h3>
                        <p className="text-gray-600">{lecture.description}</p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-lg">
                      {lecture.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default CourseCurriculum