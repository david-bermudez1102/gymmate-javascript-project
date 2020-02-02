class Program < ApplicationRecord
  belongs_to :trainer
  has_many :exercises
  has_many :stars
  has_many :views, as: :viewable
  has_attached_file :video
  validates_attachment :video, presence: true
  do_not_validate_attachment_file_type :video
  accepts_nested_attributes_for :exercises, reject_if: proc { |attributes| attributes['title'].blank? }
end
