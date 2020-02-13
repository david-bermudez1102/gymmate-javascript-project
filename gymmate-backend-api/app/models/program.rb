class Program < ApplicationRecord
  validates :title, presence: :true
  validates :description, length: { maximum: 140 }
  
  belongs_to :trainer
  has_many :workouts, dependent: :delete_all
  has_many :exercises, dependent: :delete_all
  has_many :stars, dependent: :delete_all
  has_many :views, as: :viewable, dependent: :delete_all
  has_attached_file :video
  validates_attachment :video, presence: true
  do_not_validate_attachment_file_type :video
  accepts_nested_attributes_for :exercises, reject_if: proc { |attributes| attributes['title'].blank? }

  def self.search(query)
    where('title LIKE ?', "%#{query}%")
  end
end
