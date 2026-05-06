import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select, TextArea } from '../components/FormComponents';
import { contactAPI } from '../services/api';
import { Send } from 'lucide-react';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      issue: '',
      priority: 'medium',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await contactAPI.submit(data);
      if (response.data.success) {
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl ">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        {submitted && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✓ Thank you for your message! We'll get back to you shortly.
          </div>
        )}

        <div className="bg-black border-2 border-whit rounded-xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name and Email Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="John Doe"
                required
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Invalid email address',
                  },
                })}
                error={errors.email?.message}
              />
            </div>

            {/* Phone and Priority Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Phone Number"
                placeholder="+234 xxx xxxx xxx"
                required
                {...register('phone', { required: 'Phone number is required' })}
                error={errors.phone?.message}
              />
              <Select
                label="Priority Level"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                {...register('priority')}
              />
            </div>

            {/* Subject and Issue Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Subject"
                placeholder="What is this about?"
                required
                {...register('subject', { required: 'Subject is required' })}
                error={errors.subject?.message}
              />
              <Input
                label="Issue Type"
                placeholder="e.g., Product Inquiry"
                required
                {...register('issue', { required: 'Issue type is required' })}
                error={errors.issue?.message}
              />
            </div>

            {/* Message */}
            <TextArea
              label="Message"
              placeholder="Please tell us more about your inquiry..."
              rows={6}
              required
              {...register('message', {
                required: 'Message is required',
                minLength: {
                  value: 10,
                  message: 'Message must be at least 10 characters',
                },
              })}
              error={errors.message?.message}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <Send size={18} />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold mb-2">Email</h3>
            <p>sadiqmuh1321@gmail.com</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📱</div>
            <h3 className="font-semibold mb-2">Phone</h3>
            <p>+234 xxx xxxx xxx</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p>Nigeria</p>
          </div>
        </div>
      </div>
    </div>
  );
};
